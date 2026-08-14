import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceRedirectUrl } from "@/lib/qr";
import { CopyUrlButton } from "@/components/dashboard/CopyUrlButton";
import { NfcDeviceWriter } from "@/components/dashboard/NfcDeviceWriter";
import { DEVICE_LIMIT_BY_PLAN, PLAN_LABELS } from "@/lib/display";

export const metadata = { title: "NFC setup" };

export default async function NfcSetupPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard/nfc");

  const supabase = createClient();
  const { data: devices } = await supabase
    .from("devices")
    .select("id, name, public_id")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: true });

  const plan = currentUser.subscription?.plan ?? "BASIC";
  const deviceLimit = DEVICE_LIMIT_BY_PLAN[plan];
  const atOrOverLimit = (devices?.length ?? 0) >= deviceLimit;

  if (!devices || devices.length === 0) {
    return (
      <div className="card py-16 text-center text-sm text-gray-500">
        You don&apos;t have a ReviewTap device yet.{" "}
        <Link href="/dashboard/devices/new" className="text-brand-600 hover:text-brand-700">
          Get one →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">NFC setup</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your physical NFC chip only needs to be programmed once, with the permanent ReviewTap
            URL below. Changing your review destination later happens entirely inside ReviewTap —
            you never need to reprogram the chip.
          </p>
        </div>
        <Link href="/dashboard/devices/new" className="btn-secondary shrink-0">
          Add device
        </Link>
      </div>

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

      <div className="mt-6 space-y-6">
        {devices.map((device) => {
          const url = deviceRedirectUrl(device.public_id);
          return (
            <div key={device.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-ink-900">{device.name}</h2>
                  <p className="text-xs text-gray-400">{device.public_id}</p>
                </div>
                <Link
                  href={`/dashboard/devices/${device.id}`}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Edit in Devices →
                </Link>
              </div>
              <p className="mt-3 text-sm text-gray-600">Your NFC chip should contain this URL:</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-ink-900">{url}</code>
                <CopyUrlButton url={url} label="Copy NFC URL" />
              </div>

              <div className="mt-5 border-t border-gray-100 pt-5">
                <NfcDeviceWriter url={url} />
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 text-sm font-semibold text-ink-900">Manual instructions</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        On a phone or browser without in-app NFC support (this always includes iPhone), use a free
        NFC-writing app instead.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">iPhone</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-gray-600">
            <li>Install a free NFC writing app (e.g. &ldquo;NFC Tools&rdquo;) from the App Store.</li>
            <li>Open the app and choose &ldquo;Write&rdquo;.</li>
            <li>Add a &ldquo;URL / URI&rdquo; record and paste your ReviewTap URL above.</li>
            <li>Hold your iPhone near the ReviewTap chip until the write completes.</li>
          </ol>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">Android</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-gray-600">
            <li>Install a free NFC writing app (e.g. &ldquo;NFC Tools&rdquo;) from Google Play.</li>
            <li>Make sure NFC is turned on in your phone&apos;s settings.</li>
            <li>Open the app, choose &ldquo;Write&rdquo;, and add a URL record with your ReviewTap URL.</li>
            <li>Hold your phone against the ReviewTap chip until the write completes.</li>
          </ol>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        <strong>Important:</strong> the NFC chip only needs to be programmed once. To switch between
        Google Reviews, Trustpilot, Tripadvisor or a custom URL later, just update the destination
        from Dashboard → Devices — the physical chip stays exactly the same.
      </div>
    </div>
  );
}
