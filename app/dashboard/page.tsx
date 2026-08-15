import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, type DashboardStats } from "@/lib/dashboard-stats";
import { StatCard } from "@/components/dashboard/StatCard";
import { SubscriptionBanner } from "@/components/dashboard/SubscriptionBanner";
import { ActivationBanner } from "@/components/dashboard/ActivationBanner";
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
import type { Device } from "@/types/database";

export const metadata = { title: "Dashboard" };

type DashboardDevice = Pick<Device, "id" | "name" | "public_id" | "plan" | "status" | "destination_type">;

// Shown when an account has no devices yet, so a prospective owner can see
// what the dashboard looks like before buying - clearly labelled as an
// example everywhere it's used below, never mixed with real numbers.
const SAMPLE_DEVICES: DashboardDevice[] = [
  {
    id: "sample",
    name: "Front Desk",
    public_id: "RT-DEMO1234",
    plan: "PRO",
    status: "ACTIVE",
    destination_type: "GOOGLE_REVIEWS",
  },
];

function buildSampleStats(): DashboardStats {
  const today = new Date();
  const scansOverTime = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    const scans = Math.max(0, Math.round(4 + 5 * Math.sin(i / 4.5) + i * 0.25));
    return {
      date: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date),
      scans,
    };
  });
  const totalScans = scansOverTime.reduce((sum, d) => sum + d.scans, 0);
  const scansThisWeek = scansOverTime.slice(-7).reduce((sum, d) => sum + d.scans, 0);

  return {
    totalScans,
    scansToday: scansOverTime.at(-1)?.scans ?? 0,
    scansThisWeek,
    scansThisMonth: totalScans,
    scansOverTime,
    scansByDestination: [
      { destination: "GOOGLE_REVIEWS", count: Math.round(totalScans * 0.45) },
      { destination: "FACEBOOK", count: Math.round(totalScans * 0.2) },
      { destination: "TRUSTPILOT", count: Math.round(totalScans * 0.25) },
      { destination: "TRIPADVISOR", count: Math.round(totalScans * 0.1) },
      { destination: "CUSTOM_URL", count: 0 },
    ],
  };
}

export default async function DashboardOverviewPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard");

  const supabase = createClient();
  const { data } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: true });

  const isPreview = !data || data.length === 0;
  const devices: DashboardDevice[] = isPreview ? SAMPLE_DEVICES : data;
  const stats = isPreview ? buildSampleStats() : await getDashboardStats(devices.map((d) => d.id));
  const primaryDevice = devices[0]!;
  const activeDevices = devices.filter((d) => d.status === "ACTIVE").length;
  const exampleHint = isPreview ? "Example data" : undefined;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Overview</h1>
      <p className="mt-1 text-sm text-gray-500">
        Review visits are people who tapped or scanned and were sent to your destination — not
        confirmed reviews.
      </p>

      {isPreview ? (
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
          <strong>Preview.</strong> This is an example of what your dashboard looks like, filled with
          sample data.{" "}
          <Link href="/dashboard/devices/new" className="font-medium underline hover:text-brand-900">
            Get your ReviewTap
          </Link>{" "}
          to start seeing your real numbers here.
        </div>
      ) : (
        <div className="mt-6">
          {currentUser.subscription ? (
            <SubscriptionBanner status={currentUser.subscription.status} />
          ) : (
            <ActivationBanner />
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total review visits" value={stats.totalScans} hint={exampleHint} />
        <StatCard
          label="Active ReviewTap"
          value={`${activeDevices} / ${devices.length}`}
          hint={exampleHint}
        />
        <StatCard
          label="Current platform"
          value={
            primaryDevice.plan === "PRO"
              ? "Chooser (multi-platform)"
              : DESTINATION_LABELS[primaryDevice.destination_type]
          }
          hint={exampleHint}
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
        <StatCard label="Scans today" value={stats.scansToday} hint={exampleHint} />
        <StatCard label="Scans this week" value={stats.scansThisWeek} hint={exampleHint} />
        <StatCard label="Scans this month" value={stats.scansThisMonth} hint={exampleHint} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-900">Review visits over time</h2>
          <p className="text-xs text-gray-400">Last 30 days{isPreview && " · Example data"}</p>
          <div className="mt-4">
            <ScansOverTimeChart data={stats.scansOverTime} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">By destination</h2>
          <p className="text-xs text-gray-400">Last 30 days{isPreview && " · Example data"}</p>
          <div className="mt-4">
            <ScansByDestinationChart data={stats.scansByDestination} />
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">
            {isPreview ? "Example device" : "Your devices"}
          </h2>
          {!isPreview && (
            <Link href="/dashboard/devices" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Manage devices →
            </Link>
          )}
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
