import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/require-admin";
import { Badge } from "@/components/ui/Badge";
import { AdminDeviceStatusControl } from "@/components/admin/AdminDeviceStatusControl";
import { DESTINATION_LABELS, DEVICE_STATUS_LABELS, DEVICE_STATUS_TONE } from "@/lib/display";

export const metadata = { title: "Admin · Devices" };

interface DeviceWithOwner {
  id: string;
  user_id: string;
  public_id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "SUSPENDED";
  destination_type: "GOOGLE_REVIEWS" | "TRUSTPILOT" | "TRIPADVISOR" | "CUSTOM_URL";
  profiles: { email: string; business_name: string | null } | null;
}

export default async function AdminDevicesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await requireAdminUser();
  const supabase = createClient();
  const q = searchParams.q?.trim();

  let query = supabase
    .from("devices")
    .select("id, user_id, public_id, name, status, destination_type, profiles(email, business_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) {
    query = query.ilike("public_id", `%${q}%`);
  }

  const { data } = await query;
  const devices = (data ?? []) as unknown as DeviceWithOwner[];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Devices</h1>

      <form className="mt-4" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by device ID (e.g. RT-A7X92KLM)…"
          className="input max-w-sm"
        />
      </form>

      <div className="card mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-3">Device</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink-900">{device.name}</p>
                  <p className="text-xs text-gray-400">{device.public_id}</p>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${device.user_id}`} className="text-brand-600 hover:text-brand-700">
                    {device.profiles?.business_name || device.profiles?.email || "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{DESTINATION_LABELS[device.destination_type]}</td>
                <td className="px-4 py-3">
                  <Badge tone={DEVICE_STATUS_TONE[device.status]}>{DEVICE_STATUS_LABELS[device.status]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <AdminDeviceStatusControl deviceId={device.id} status={device.status} />
                </td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No devices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
