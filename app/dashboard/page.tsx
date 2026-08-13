import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/dashboard-stats";
import { StatCard } from "@/components/dashboard/StatCard";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";
import { Badge } from "@/components/ui/Badge";
import { ScansOverTimeChart } from "@/components/dashboard/charts/ScansOverTimeChart";
import { ScansByDestinationChart } from "@/components/dashboard/charts/ScansByDestinationChart";
import {
  DESTINATION_LABELS,
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_TONE,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_TONE,
} from "@/lib/display";

export const metadata = { title: "Dashboard" };

export default async function DashboardOverviewPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard");

  const supabase = createClient();
  const { data: devices } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: true });

  if (!devices || devices.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-lg font-semibold text-ink-900">No ReviewTap devices yet</h1>
        <p className="max-w-sm text-sm text-gray-500">
          Once you complete checkout, your ReviewTap device and dynamic URL will show up here.
        </p>
        <Link href="/shop" className="btn-primary mt-2">
          Get your ReviewTap
        </Link>
      </div>
    );
  }

  const stats = await getDashboardStats(devices.map((d) => d.id));
  const primaryDevice = devices[0]!;
  const activeDevices = devices.filter((d) => d.status === "ACTIVE").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Overview</h1>
      <p className="mt-1 text-sm text-gray-500">
        Review visits are people who tapped or scanned and were sent to your destination — not
        confirmed reviews.
      </p>

      <div className="mt-6">
        <SubscriptionBanner status={currentUser.subscription?.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total review visits" value={stats.totalScans} />
        <StatCard label="Active ReviewTap" value={`${activeDevices} / ${devices.length}`} />
        <StatCard
          label="Current platform"
          value={
            primaryDevice.plan === "PRO"
              ? "Chooser (multi-platform)"
              : DESTINATION_LABELS[primaryDevice.destination_type]
          }
        />
        <StatCard
          label="Subscription"
          value={
            currentUser.subscription ? (
              <Badge tone={SUBSCRIPTION_STATUS_TONE[currentUser.subscription.status]}>
                {SUBSCRIPTION_STATUS_LABELS[currentUser.subscription.status]}
              </Badge>
            ) : (
              <Badge tone="gray">None</Badge>
            )
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Scans today" value={stats.scansToday} />
        <StatCard label="Scans this week" value={stats.scansThisWeek} />
        <StatCard label="Scans this month" value={stats.scansThisMonth} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-900">Review visits over time</h2>
          <p className="text-xs text-gray-400">Last 30 days</p>
          <div className="mt-4">
            <ScansOverTimeChart data={stats.scansOverTime} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">By destination</h2>
          <p className="text-xs text-gray-400">Last 30 days</p>
          <div className="mt-4">
            <ScansByDestinationChart data={stats.scansByDestination} />
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Your devices</h2>
          <Link href="/dashboard/devices" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Manage devices →
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-gray-100">
          {devices.map((device) => (
            <li key={device.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{device.name}</p>
                <p className="text-xs text-gray-400">{device.public_id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {device.plan === "PRO" ? "Chooser" : DESTINATION_LABELS[device.destination_type]}
                </span>
                <Badge tone={DEVICE_STATUS_TONE[device.status]}>
                  {DEVICE_STATUS_LABELS[device.status]}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
