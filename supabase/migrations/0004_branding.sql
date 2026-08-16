-- Guest-page branding: lets a business customise the Pro chooser page with
-- their own logo, an accent colour, and a short welcome/thank-you message.
-- Lives on `profiles` (account-level), not `devices`, since one account's
-- devices/locations share the same branding - see app/r/[deviceId]/choose.

alter table public.profiles
  add column logo_url text,
  add column accent_color text,
  add column welcome_message text,
  add column thank_you_message text;

alter table public.profiles
  add constraint profiles_accent_color_format
  check (accent_color is null or accent_color ~ '^#[0-9a-fA-F]{6}$');

comment on column public.profiles.logo_url is 'Optional https:// logo shown on the Pro chooser page instead of the ReviewTap logo.';
comment on column public.profiles.accent_color is 'Optional #rrggbb used for small accents (stars, card border) on the Pro chooser page.';
comment on column public.profiles.welcome_message is 'Optional short greeting shown under the title on the Pro chooser page.';
comment on column public.profiles.thank_you_message is 'Optional message shown right after a guest picks a star rating.';

-- get_redirect_target's return shape changes (new columns), which Postgres
-- treats as a different function - CREATE OR REPLACE can't do that for a
-- `returns table (...)` function, so drop and recreate.

drop function if exists public.get_redirect_target(text);

create function public.get_redirect_target(p_public_id text)
returns table (
  device_id uuid,
  device_status public.device_status,
  device_plan public.device_plan,
  destination_type public.destination_type,
  destination_url text,
  destinations jsonb,
  subscription_active boolean,
  business_name text,
  logo_url text,
  accent_color text,
  welcome_message text,
  thank_you_message text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id as device_id,
    d.status as device_status,
    d.plan as device_plan,
    d.destination_type,
    d.destination_url,
    d.destinations,
    coalesce(s.status in ('active', 'trialing'), false) as subscription_active,
    p.business_name,
    p.logo_url,
    p.accent_color,
    p.welcome_message,
    p.thank_you_message
  from public.devices d
  join public.profiles p on p.id = d.user_id
  left join lateral (
    select status
    from public.subscriptions
    where subscriptions.user_id = d.user_id
    order by created_at desc
    limit 1
  ) s on true
  where d.public_id = p_public_id
  limit 1;
$$;

revoke all on function public.get_redirect_target(text) from public;
grant execute on function public.get_redirect_target(text) to service_role;
