import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceRedirectUrl, generateQrPngDataUrl } from "@/lib/qr";
import { getScansByPlatform } from "@/lib/dashboard-stats";
import { Badge } from "@/components/ui/Badge";
import { CopyUrlButton } from "@/components/dashboard/CopyUrlButton";
import { DeviceStatusToggle } from "@/components/dashboard/DeviceStatusToggle";
import { ActivationBanner } from "@/components/dashboard/ActivationBanner";
import { ShareQrButton } from "@/components/dashboard/ShareQrButton";
import {
  DESTINATION_COLORS,
  DESTINATION_LABELS,
  DEVICE_LIMIT_BY_PLAN,
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_TONE,
  DEVICE_VARIANT_LABELS,
  PLAN_LABELS,
} from "@/lib/display";
import { formatDate } from "@/lib/utils";
import type { DestinationType } from "@/types/database";

export const metadata = { title: "Devices" };

export default async function DevicesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard/devices");

  const supabase = createClient();
  const { data: devices } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: true });

  const plan = currentUser.subscription?.plan ?? "BASIC";
  const deviceLimit = DEVICE_LIMIT_BY_PLAN[plan];
  const atOrOverLimit = (devices?.length ?? 0) >= deviceLimit;

  const deviceIds = (devices ?? []).map((d) => d.id);
  const scanCounts = new Map<string, number>();

  if (deviceIds.length > 0) {
    await Promise.all(
      deviceIds.map(async (id) => {
        const { count } = await supabase
          .from("scans")
          .select("id", { count: "exact", head: true })
          .eq("device_id", id);
        scanCounts.set(id, count ?? 0);
      }),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Devices</h1>
          <p className="mt-1 text-sm text-gray-400">
            {devices?.length ?? 0} of {deviceLimit} devices on your {PLAN_LABELS[plan]} plan
          </p>
        </div>
        <Link href="/dashboard/devices/new" className="btn-secondary">
          Add another ReviewTap
        </Link>
      </div>

      {!currentUser.hasActiveSubscription && devices && devices.length > 0 && (
        <div className="mt-4">
          <ActivationBanner />
        </div>
      )}

      {atOrOverLimit && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You&apos;ve reached the {deviceLimit}-device limit for the {PLAN_LABELS[plan]} plan.{" "}
          {plan === "BASIC" ? (
            <>
              <Link href="/dashboard/billing" className="font-medium underline hover:text-amber-900">
                Upgrade to Pro
              </Link>{" "}
              for up to {DEVICE_LIMIT_BY_PLAN.PRO} devices.
            </>
          ) : (
            "You can still add another ReviewTap if you need one."
          )}
        </div>
      )}

      {!devices || devices.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-gray-500">You don&apos;t have any ReviewTap devices yet.</p>
          <Link href="/dashboard/devices/new" className="btn-primary">
            Get your ReviewTap
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {await Promise.all(
            devices.map(async (device) => {
              const url = deviceRedirectUrl(device.public_id);
              const enabledTypes = new Set(
                device.destinations.filter((d) => d.enabled).map((d) => d.type),
              );
              const [qrDataUrl, platformBreakdown] = await Promise.all([
                generateQrPngDataUrl(url),
                device.plan === "PRO" ? getScansByPlatform(device.id) : Promise.resolve([]),
              ]);
              const usedPlatforms = platformBreakdown.filter(
                (p) => enabledTypes.has(p.destination as DestinationType) && p.count > 0,
              );
              return (
                <div key={device.id} className="card flex gap-5">
                  <div className="shrink-0 overflow-hidden rounded-xl border border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${device.name}`}
                      width={104}
                      height={104}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink-900">{device.name}</p>
                        <p className="text-xs text-gray-400">
                          {device.public_id} · {DEVICE_VARIANT_LABELS[device.variant]} ·{" "}
                          {PLAN_LABELS[device.plan]} plan
                        </p>
                      </div>
                      <Badge tone={DEVICE_STATUS_TONE[device.status]}>
                        {DEVICE_STATUS_LABELS[device.status]}
                      </Badge>
                    </div>

                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <dt className="text-gray-400">Destination</dt>
                      <dd className="text-ink-900">
                        {device.plan === "PRO"
                          ? `${device.destinations.filter((d) => d.enabled).length} platforms (chooser)`
                          : DESTINATION_LABELS[device.destination_type]}
                      </dd>
                      <dt className="text-gray-400">Total scans</dt>
                      <dd className="text-ink-900">{scanCounts.get(device.id) ?? 0}</dd>
                      <dt className="text-gray-400">Created</dt>
                      <dd className="text-ink-900">{formatDate(device.created_at)}</dd>
                    </dl>

                    {device.plan === "PRO" && usedPlatforms.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400">Visits by platform</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {usedPlatforms
                            .sort((a, b) => b.count - a.count)
                            .map((p) => (
                              <span
                                key={p.destination}
                                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-1 pr-2.5 text-xs font-medium text-ink-900"
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      DESTINATION_COLORS[p.destination as DestinationType] ?? "#9ca3af",
                                  }}
                                  aria-hidden
                                />
                                {DESTINATION_LABELS[p.destination as DestinationType] ?? p.destination}{" "}
                                {p.count}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/dashboard/devices/${device.id}`} className="btn-primary">
                        Edit
                      </Link>
                      <DeviceStatusToggle deviceId={device.id} status={device.status} />
                      <CopyUrlButton url={url} />
                      <a href={`/api/devices/${device.id}/qr?format=png&download=1`} className="btn-secondary">
                        Download QR
                      </a>
                      <ShareQrButton
                        qrUrl={`/api/devices/${device.id}/qr?format=png`}
                        filename={`reviewtap-${device.public_id.toLowerCase()}.png`}
                        title={`${device.name} — ReviewTap QR code`}
                      />
                    </div>
                  </div>
                </div>
              );
            }),
          )}
        </div>
      )}
    </div>
  );
}
