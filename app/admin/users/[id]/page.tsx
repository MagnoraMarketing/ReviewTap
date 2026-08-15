import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/require-admin";
import { Badge } from "@/components/ui/Badge";
import { AdminDeviceStatusControl } from "@/components/admin/AdminDeviceStatusControl";
import { AdminTestSubscriptionControl } from "@/components/admin/AdminTestSubscriptionControl";
import {
  DESTINATION_LABELS,
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_TONE,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_TONE,
} from "@/lib/display";
import { formatDate } from "@/lib/utils";
import { isTestSubscription } from "@/lib/admin-test-subscription";

export const metadata = { title: "Admin · User" };

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  await requireAdminUser();
  const supabase = createClient();

  const [{ data: profile }, { data: subscription }, { data: devices }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", params.id).single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", params.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("devices").select("*").eq("user_id", params.id).order("created_at", { ascending: true }),
  ]);

  if (!profile) notFound();

  const deviceIds = (devices ?? []).map((d) => d.id);
  const { count: totalScans } = deviceIds.length
    ? await supabase.from("scans").select("id", { count: "exact", head: true }).in("device_id", deviceIds)
    : { count: 0 };

  return (
    <div>
      <Link href="/admin/users" className="text-sm text-gray-500 hover:text-ink-900">
        ← All users
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">{profile.business_name || profile.email}</h1>
          <p className="text-sm text-gray-400">{profile.email}</p>
        </div>
        <Badge tone={profile.role === "ADMIN" ? "blue" : "gray"}>{profile.role}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">Profile</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Name</dt>
              <dd className="text-ink-900">{profile.name || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Phone</dt>
              <dd className="text-ink-900">{profile.phone || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Joined</dt>
              <dd className="text-ink-900">{formatDate(profile.created_at)}</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">Subscription</h2>
          {subscription ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Status</dt>
                <dd>
                  <Badge tone={SUBSCRIPTION_STATUS_TONE[subscription.status]}>
                    {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                  </Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Period end</dt>
                <dd className="text-ink-900">
                  {subscription.current_period_end ? formatDate(subscription.current_period_end) : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Stripe customer</dt>
                <dd className="truncate text-xs text-ink-900">{subscription.stripe_customer_id}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-gray-400">No subscription on file.</p>
          )}
          <AdminTestSubscriptionControl
            userId={profile.id}
            subscriptionKind={
              !subscription ? "none" : isTestSubscription(subscription.stripe_customer_id) ? "test" : "real"
            }
          />
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">Usage</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Devices</dt>
              <dd className="text-ink-900">{devices?.length ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Total scans</dt>
              <dd className="text-ink-900">{totalScans ?? 0}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Devices</h2>
        <div className="mt-4 divide-y divide-gray-100">
          {(devices ?? []).map((device) => (
            <div key={device.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-ink-900">
                  {device.name} <span className="text-xs text-gray-400">({device.public_id})</span>
                </p>
                <p className="text-xs text-gray-400">{DESTINATION_LABELS[device.destination_type]}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={DEVICE_STATUS_TONE[device.status]}>{DEVICE_STATUS_LABELS[device.status]}</Badge>
                <AdminDeviceStatusControl deviceId={device.id} status={device.status} />
              </div>
            </div>
          ))}
          {(!devices || devices.length === 0) && (
            <p className="py-4 text-sm text-gray-400">No devices.</p>
          )}
        </div>
      </div>
    </div>
  );
}
