-- Guest feedback: a lightweight rating + optional free-text message captured
-- on the Pro chooser page, alongside (never instead of) the public review
-- platform links. See app/r/[deviceId]/choose/page.tsx.

create type public.feedback_status as enum ('NEW', 'READ', 'RESOLVED');

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  message text,
  status public.feedback_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index feedback_device_id_idx on public.feedback (device_id);
create index feedback_status_idx on public.feedback (status);
create index feedback_created_at_idx on public.feedback (created_at desc);

comment on table public.feedback is 'One row per guest rating from the Pro chooser page. Inserted by the service role only (guests are never authenticated) - see /api/feedback.';
comment on column public.feedback.message is 'Optional "tell us more" text, attached via a follow-up PATCH after the initial rating is recorded.';

create trigger feedback_set_updated_at
  before update on public.feedback
  for each row execute function public.set_updated_at();

-- Same reasoning as protect_device_privileged_columns (0001_init.sql): RLS
-- is row-level only, so without this a signed-in device owner could PATCH
-- their own feedback row via the REST API and rewrite the guest's rating or
-- message, not just its status. Only the app's "status" field is meant to
-- be owner-editable.

create or replace function public.protect_feedback_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' and not public.is_admin() then
    new.device_id := old.device_id;
    new.rating := old.rating;
    new.message := old.message;
  end if;
  return new;
end;
$$;

create trigger feedback_protect_privileged_columns
  before update on public.feedback
  for each row execute function public.protect_feedback_privileged_columns();

alter table public.feedback enable row level security;

-- Readable/updatable (status only, via the app layer) by the owning
-- device's user or an admin. No insert/delete policy for authenticated
-- users - inserts happen only via the service role from /api/feedback,
-- matching the `scans` table's pattern.

create policy "feedback_select_owner_or_admin"
  on public.feedback for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.devices
      where devices.id = feedback.device_id and devices.user_id = auth.uid()
    )
  );

create policy "feedback_update_owner_or_admin"
  on public.feedback for update
  using (
    public.is_admin()
    or exists (
      select 1 from public.devices
      where devices.id = feedback.device_id and devices.user_id = auth.uid()
    )
  );
