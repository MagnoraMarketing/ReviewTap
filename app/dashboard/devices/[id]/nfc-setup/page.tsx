import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceRedirectUrl } from "@/lib/qr";
import { CopyUrlButton } from "@/components/dashboard/CopyUrlButton";
import { NfcDeviceWriter } from "@/components/dashboard/NfcDeviceWriter";

export const metadata = { title: "Connect your NFC tag" };

/**
 * The step "Add device" lands on right after creating a device, so
 * connecting the physical NFC tag happens as one continuous flow instead of
 * requiring a separate trip to Dashboard -> NFC setup afterwards. Only own
 * NFC (Web NFC needs Chrome/Android); a QR-only device can just skip ahead.
 */
export default async function DeviceNfcSetupPage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect(`/login?next=/dashboard/devices/${params.id}/nfc-setup`);

  const supabase = createClient();
  const { data: device } = await supabase
    .from("devices")
    .select("id, name, public_id")
    .eq("id", params.id)
    .single();

  if (!device) notFound();

  const url = deviceRedirectUrl(device.public_id);

  return (
    <div className="mx-auto max-w-lg">
      <p className="text-sm font-medium text-brand-600">Step 2 of 2</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink-900">Connect your NFC tag</h1>
      <p className="mt-1 text-sm text-gray-500">
        &ldquo;{device.name}&rdquo; is created. Hold your blank NFC tag against your phone now to
        write its permanent ReviewTap link — or skip this if you&apos;re only using a QR code.
      </p>

      <div className="card mt-6">
        <p className="text-sm text-gray-600">This is the link that gets written to the chip:</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-ink-900">{url}</code>
          <CopyUrlButton url={url} />
        </div>
        <div className="mt-5 border-t border-gray-100 pt-5">
          <NfcDeviceWriter url={url} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href={`/dashboard/devices/${device.id}`} className="btn-primary">
          Continue to device settings
        </Link>
        <Link href="/dashboard/devices" className="text-sm text-gray-500 hover:text-ink-900">
          Skip for now
        </Link>
      </div>
    </div>
  );
}
