-- ReviewTap initial schema
-- Tables: profiles, subscriptions, devices, scans
-- Includes RLS policies. Run via `supabase db push` or the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum ('USER', 'ADMIN');

create type public.subscription_status as enum (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'paused'
);

create type public.device_status as enum ('ACTIVE', 'PAUSED', 'SUSPENDED');

create type public.destination_type as enum (
  'GOOGLE_REVIEWS',
  'FACEBOOK',
  'TRUSTPILOT',
  'TRIPADVISOR',
  'CUSTOM_URL'
);

create type public.device_variant as enum ('STANDEE_CARD', 'DESK_TILE');

-- BASIC: single fixed destination, direct redirect.
-- PRO: visitor lands on a chooser page and picks from several enabled
-- platforms (and can share that chooser link) - see devices.destinations.
create type public.device_plan as enum ('BASIC', 'PRO');

create type public.scan_type as enum ('NFC', 'QR', 'DIRECT', 'UNKNOWN');

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  business_name text,
  name text,
  phone text,
  role public.user_role not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per authenticated user, mirrors auth.users plus business info.';

-- ---------------------------------------------------------------------------
-- subscriptions
-- ---------------------------------------------------------------------------

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  plan public.device_plan not null default 'BASIC',
  status public.subscription_status not null default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (stripe_customer_id),
  unique (stripe_subscription_id)
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_status_idx on public.subscriptions (status);

comment on table public.subscriptions is 'Stripe is the source of truth; this table is a read replica kept in sync via webhooks.';

-- ---------------------------------------------------------------------------
-- devices
-- ---------------------------------------------------------------------------

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  public_id text not null unique,
  name text not null default 'My ReviewTap',
  variant public.device_variant not null default 'STANDEE_CARD',
  plan public.device_plan not null default 'BASIC',
  status public.device_status not null default 'ACTIVE',
  destination_type public.destination_type not null default 'GOOGLE_REVIEWS',
  destination_url text,
  destinations jsonb not null default '[]'::jsonb,
  stripe_checkout_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index devices_user_id_idx on public.devices (user_id);
create index devices_public_id_idx on public.devices (public_id);

comment on table public.devices is 'A physical NFC/QR device. public_id is the value embedded in the NFC chip and QR code, e.g. RT-A7X92KLM.';
comment on column public.devices.destination_url is 'BASIC plan: validated https:// URL the /r/[public_id] route redirects visitors to directly.';
comment on column public.devices.destinations is 'PRO plan only: jsonb array of {type, url, enabled} - visitor picks one on the /r/[public_id]/choose page. Ignored for BASIC devices.';

-- ---------------------------------------------------------------------------
-- scans
-- ---------------------------------------------------------------------------

create table public.scans (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices (id) on delete cascade,
  scan_type public.scan_type not null default 'UNKNOWN',
  destination_type public.destination_type,
  "timestamp" timestamptz not null default now(),
  user_agent text,
  referrer text,
  country text,
  city text,
  device_type text
);

create index scans_device_id_idx on public.scans (device_id);
create index scans_timestamp_idx on public.scans ("timestamp" desc);

comment on table public.scans is 'One row per redirect visit. No IP addresses are stored - see /privacy. country/city come only from edge geo headers when available.';

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create trigger devices_set_updated_at
  before update on public.devices
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Column-level protection for devices.
-- RLS is row-level only, so a signed-in owner could otherwise PATCH their
-- own device row directly via the REST API and rewrite purchase-time fields
-- (plan, variant, public_id) or force status to SUSPENDED (an admin-only
-- action). This trigger pins those fields back to their prior value for any
-- caller that isn't the service role or an admin, regardless of what the
-- application layer already validates.
-- ---------------------------------------------------------------------------

create or replace function public.protect_device_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' and not public.is_admin() then
    new.plan := old.plan;
    new.variant := old.variant;
    new.public_id := old.public_id;
    new.user_id := old.user_id;
    new.stripe_checkout_session_id := old.stripe_checkout_session_id;
    if new.status = 'SUSPENDED' then
      new.status := old.status;
    end if;
  end if;
  return new;
end;
$$;

create trigger devices_protect_privileged_columns
  before update on public.devices
  for each row execute function public.protect_device_privileged_columns();

-- ---------------------------------------------------------------------------
-- Auto-create profile row when a new auth user signs up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Helper: is the current user an admin?
-- SECURITY DEFINER + fixed search_path avoids RLS recursion when this is
-- used inside policies on public.profiles itself.
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.devices enable row level security;
alter table public.scans enable row level security;

-- profiles: users can read/update their own row; admins can read all.
-- Nobody (besides the service role, which bypasses RLS) can change `role`
-- from the client - there is deliberately no policy allowing role escalation.

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'USER');

-- subscriptions: users can read their own; writes happen only via the
-- service role from Stripe webhooks (no insert/update/delete policy for
-- authenticated users).

create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  using (user_id = auth.uid() or public.is_admin());

-- devices: users manage their own devices; admins can read/update all
-- (e.g. to suspend a device).

create policy "devices_select_own_or_admin"
  on public.devices for select
  using (user_id = auth.uid() or public.is_admin());

create policy "devices_insert_own"
  on public.devices for insert
  with check (user_id = auth.uid());

create policy "devices_update_own_or_admin"
  on public.devices for update
  using (user_id = auth.uid() or public.is_admin());

-- scans: readable by the owning device's user or an admin. Inserts happen
-- only via the service role from the redirect route (no insert policy for
-- authenticated/anon users - visitors scanning a device are not signed in).

create policy "scans_select_owner_or_admin"
  on public.scans for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.devices
      where devices.id = scans.device_id and devices.user_id = auth.uid()
    )
  );
