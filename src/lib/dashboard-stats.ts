import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Scan } from "@/types/database";

export interface DashboardStats {
  totalScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  scansOverTime: { date: string; scans: number }[];
  scansByDestination: { destination: string; count: number }[];
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getDashboardStats(deviceIds: string[]): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalScans: 0,
    scansToday: 0,
    scansThisWeek: 0,
    scansThisMonth: 0,
    scansOverTime: [],
    scansByDestination: [],
  };
  if (deviceIds.length === 0) return empty;

  const supabase = createClient();
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 29);

  const [{ count: totalScans }, { data: recentScans }] = await Promise.all([
    supabase
      .from("scans")
      .select("id", { count: "exact", head: true })
      .in("device_id", deviceIds),
    supabase
      .from("scans")
      .select("timestamp, destination_type")
      .in("device_id", deviceIds)
      .gte("timestamp", startOfDay(windowStart).toISOString())
      .order("timestamp", { ascending: true })
      .limit(10_000),
  ]);

  const scans = (recentScans ?? []) as Pick<Scan, "timestamp" | "destination_type">[];

  const today = startOfDay(now);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const monthStart = new Date(today);
  monthStart.setDate(monthStart.getDate() - 29);

  let scansToday = 0;
  let scansThisWeek = 0;
  let scansThisMonth = 0;

  const byDay = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    byDay.set(d.toISOString().slice(0, 10), 0);
  }

  const byDestination = new Map<string, number>([
    ["GOOGLE_REVIEWS", 0],
    ["FACEBOOK", 0],
    ["TRUSTPILOT", 0],
    ["TRIPADVISOR", 0],
    ["CUSTOM_URL", 0],
  ]);

  for (const scan of scans) {
    const scanDate = new Date(scan.timestamp);
    if (scanDate >= today) scansToday++;
    if (scanDate >= weekStart) scansThisWeek++;
    if (scanDate >= monthStart) scansThisMonth++;

    const dayKey = scanDate.toISOString().slice(0, 10);
    if (byDay.has(dayKey)) byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + 1);

    if (scan.destination_type) {
      byDestination.set(scan.destination_type, (byDestination.get(scan.destination_type) ?? 0) + 1);
    }
  }

  const scansOverTime = Array.from(byDay.entries()).map(([date, count]) => ({
    date: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(date)),
    scans: count,
  }));

  const scansByDestination = Array.from(byDestination.entries()).map(([destination, count]) => ({
    destination,
    count,
  }));

  return {
    totalScans: totalScans ?? 0,
    scansToday,
    scansThisWeek,
    scansThisMonth,
    scansOverTime,
    scansByDestination,
  };
}

/**
 * Review visits per platform for a single device, optionally scoped to a
 * trailing window in days (omit for all-time). Powers the "Review visits by
 * platform" chart on the device detail page and the per-device platform
 * breakdown on the devices list.
 */
export async function getScansByPlatform(
  deviceId: string,
  days?: number,
): Promise<{ destination: string; count: number }[]> {
  const supabase = createClient();

  let query = supabase
    .from("scans")
    .select("destination_type")
    .eq("device_id", deviceId)
    .not("destination_type", "is", null);

  if (days !== undefined) {
    const windowStart = startOfDay(new Date());
    windowStart.setDate(windowStart.getDate() - (days - 1));
    query = query.gte("timestamp", windowStart.toISOString());
  }

  const { data } = await query;

  const byDestination = new Map<string, number>([
    ["GOOGLE_REVIEWS", 0],
    ["FACEBOOK", 0],
    ["TRUSTPILOT", 0],
    ["TRIPADVISOR", 0],
    ["CUSTOM_URL", 0],
  ]);

  for (const row of (data ?? []) as Pick<Scan, "destination_type">[]) {
    if (!row.destination_type) continue;
    byDestination.set(row.destination_type, (byDestination.get(row.destination_type) ?? 0) + 1);
  }

  return Array.from(byDestination.entries()).map(([destination, count]) => ({ destination, count }));
}
