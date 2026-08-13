import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/require-admin";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatEuro } from "@/lib/utils";

export const metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  await requireAdminUser();
  const supabase = createClient();

  const [
    { count: totalUsers },
    { count: totalDevices },
    { count: totalScans },
    { count: activeSubs },
    { count: trialingSubs },
    { count: canceledSubs },
    { count: pastDueSubs },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("devices").select("id", { count: "exact", head: true }),
    supabase.from("scans").select("id", { count: "exact", head: true }),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "trialing"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "canceled"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "past_due"),
  ]);

  const estimatedMrrCents = ((activeSubs ?? 0) + (trialingSubs ?? 0)) * 2000;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Admin overview</h1>
      <p className="mt-1 text-sm text-gray-500">
        Stripe remains the source of truth for billing — figures below are read from our local
        replica and may lag a webhook delivery.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={totalUsers ?? 0} />
        <StatCard label="Total devices" value={totalDevices ?? 0} />
        <StatCard label="Total scans" value={totalScans ?? 0} />
        <StatCard label="Estimated MRR" value={formatEuro(estimatedMrrCents)} hint="Active + trialing × €20" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active subscriptions" value={activeSubs ?? 0} />
        <StatCard label="Trialing" value={trialingSubs ?? 0} />
        <StatCard label="Past due" value={pastDueSubs ?? 0} />
        <StatCard label="Canceled" value={canceledSubs ?? 0} />
      </div>
    </div>
  );
}
