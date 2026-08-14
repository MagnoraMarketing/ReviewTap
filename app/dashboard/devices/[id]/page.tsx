import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceRedirectUrl, generateQrPngDataUrl } from "@/lib/qr";
import { getDashboardStats, getScansByPlatform } from "@/lib/dashboard-stats";
import { Badge } from "@/components/ui/Badge";
import { CopyUrlButton } from "@/components/dashboard/CopyUrlButton";
import { DeviceStatusToggle } from "@/components/dashboard/DeviceStatusToggle";
import { DestinationForm } from "@/components/dashboard/DestinationForm";
import { MultiDestinationForm } from "@/components/dashboard/MultiDestinationForm";
import { DeviceNameForm } from "@/components/dashboard/DeviceNameForm";
import { NfcDeviceWriter } from "@/components/dashboard/NfcDeviceWriter";
import { ScansOverTimeChart } from "@/components/dashboard/charts/ScansOverTimeChart";
import { ReviewsByPlatformChart } from "@/components/dashboard/charts/ReviewsByPlatformChart";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_TONE,
  DEVICE_VARIANT_LABELS,
  PLAN_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_TONE,
} from "@/lib/display";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Device settings" };

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(`/login?next=/dashboard/devices/${params.id}`);

  const supabase = createClient();
  const { data: device } = await supabase.from("devices").select("*").eq("id", params.id).single();

  if (!device) notFound();

  const url = deviceRedirectUrl(device.public_id);
  const [qrDataUrl, stats, platformStats, { data: accountDevices }] = await Promise.all([
    generateQrPngDataUrl(url),
    getDashboardStats([device.id]),
    device.plan === "PRO" ? getScansByPlatform(device.id, 7) : Promise.resolve([]),
    supabase.from("devices").select("status").eq("user_id", currentUser.id),
  ]);

  const activeDeviceCount = (accountDevices ?? []).filter((d) => d.status === "ACTIVE").length;
  const totalDeviceCount = (accountDevices ?? []).length;

  return (
    <div>
      <Link href="/dashboard/devices" className="text-sm text-gray-500 hover:text-ink-900">
        ← Back to devices
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">{device.name}</h1>
          <p className="text-sm text-gray-400">
            {device.public_id} · {DEVICE_VARIANT_LABELS[device.variant]} · {PLAN_LABELS[device.plan]} plan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={DEVICE_STATUS_TONE[device.status]}>{DEVICE_STATUS_LABELS[device.status]}</Badge>
          <DeviceStatusToggle deviceId={device.id} status={device.status} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total review visits" value={stats.totalScans} />
        <StatCard label="This month" value={stats.scansThisMonth} />
        <StatCard label="Active devices" value={`${activeDeviceCount} / ${totalDeviceCount}`} />
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

      <div className="card mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Set up your chip</h2>
        <p className="mt-1 text-xs text-gray-400">
          This is the permanent link written to your NFC chip and encoded in your QR code.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-ink-900">{url}</code>
          <CopyUrlButton url={url} />
        </div>
        <div className="mt-5 border-t border-gray-100 pt-5">
          <NfcDeviceWriter url={url} />
        </div>
      </div>

      {device.plan === "PRO" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-sm font-semibold text-ink-900">Choose platforms</h2>
            <p className="mt-1 text-xs text-gray-400">
              Visitors pick one of these when they tap or scan.
            </p>
            <div className="mt-4">
              <MultiDestinationForm deviceId={device.id} initialDestinations={device.destinations} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-ink-900">Review visits by platform</h2>
            <p className="mt-1 text-xs text-gray-400">Last 7 days</p>
            <div className="mt-4">
              <ReviewsByPlatformChart data={platformStats} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card mt-6">
          <h2 className="text-sm font-semibold text-ink-900">Review destination</h2>
          <p className="mt-1 text-xs text-gray-400">
            Choose where the NFC tap and QR scan send your customers.
          </p>
          <div className="mt-4">
            <DestinationForm
              deviceId={device.id}
              initialType={device.destination_type}
              initialUrl={device.destination_url}
            />
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">QR code</h2>
          <div className="mt-4 flex justify-center rounded-xl border border-gray-100 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR code for ${device.name}`} width={180} height={180} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={`/api/devices/${device.id}/qr?format=png&download=1`} className="btn-secondary">
              PNG
            </a>
            <a href={`/api/devices/${device.id}/qr?format=svg&download=1`} className="btn-secondary">
              SVG
            </a>
          </div>
          <Link href={`/dashboard/devices/${device.id}/print`} className="btn-primary mt-2 w-full">
            Print QR card
          </Link>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-900">Device name</h2>
          <div className="mt-3">
            <DeviceNameForm deviceId={device.id} initialName={device.name} />
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Scans over time</h2>
        <p className="mt-1 text-xs text-gray-400">Last 30 days</p>
        <div className="mt-4">
          <ScansOverTimeChart data={stats.scansOverTime} />
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">Created {formatDate(device.created_at)}</p>
    </div>
  );
}
