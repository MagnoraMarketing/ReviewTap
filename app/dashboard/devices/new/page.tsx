import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { NewDeviceForm } from "@/components/dashboard/NewDeviceForm";
import { DEVICE_LIMIT_BY_PLAN, PLAN_LABELS } from "@/lib/display";

export const metadata = { title: "Add a device" };

export default async function NewDevicePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard/devices/new");

  const supabase = createClient();
  const { count } = await supabase
    .from("devices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", currentUser.id);

  const plan = currentUser.subscription?.plan ?? "BASIC";
  const limit = DEVICE_LIMIT_BY_PLAN[plan];
  const atOrOverLimit = (count ?? 0) >= limit;

  return (
    <div>
      <Link href="/dashboard/devices" className="text-sm text-gray-500 hover:text-ink-900">
        ← Back to devices
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-ink-900">Add a device</h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        ReviewTap works with any NFC tag or QR code, not just cards bought from us. Configuring one
        is completely free — you only need an active subscription once you&apos;re ready for it to
        actually work for real visitors.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">Use your own NFC tag or QR code</h2>
          <p className="mt-1 text-xs text-gray-400">
            Free. Creates a permanent ReviewTap link you write to any blank NFC tag or print as a
            QR code yourself. Configure your destinations and preview everything now — activate it
            with a subscription whenever you&apos;re ready.
          </p>

          <div className="mt-4">
            {atOrOverLimit ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                You&apos;ve reached the {limit}-device limit for the {PLAN_LABELS[plan]} plan.{" "}
                {plan === "BASIC" ? (
                  <>
                    <Link href="/dashboard/billing" className="font-medium underline hover:text-amber-900">
                      Upgrade to Pro
                    </Link>{" "}
                    for up to {DEVICE_LIMIT_BY_PLAN.PRO} devices.
                  </>
                ) : null}
              </div>
            ) : (
              <NewDeviceForm />
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-ink-900">Buy a ReviewTap card</h2>
          <p className="mt-1 text-xs text-gray-400">
            €50 one-time. A pre-made physical Standee Card or Desk Tile, shipped to you.
          </p>
          <Link href="/shop" className="btn-secondary mt-4">
            Go to shop →
          </Link>
        </div>
      </div>
    </div>
  );
}
