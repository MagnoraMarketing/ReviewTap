-- Single round-trip lookup used by the hot-path /r/[deviceId] redirect route.
-- SECURITY DEFINER so it can read across devices/subscriptions regardless of
-- caller (the route calls this with the service-role client, which already
-- bypasses RLS - security definer here just keeps the function usable from
-- a plain authenticated context too, e.g. for debugging).

create or replace function public.get_redirect_target(p_public_id text)
returns table (
  device_id uuid,
  device_status public.device_status,
  device_plan public.device_plan,
  destination_type public.destination_type,
  destination_url text,
  destinations jsonb,
  subscription_active boolean,
  business_name text
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
    p.business_name
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
