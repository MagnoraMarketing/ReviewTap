import Link from "next/link";

/**
 * Shown wherever a signed-in owner is looking at their own ReviewTap
 * configuration without an active subscription. Configuring, previewing and
 * saving is always free - this only clarifies that real visitors won't be
 * redirected yet, and points at the one thing that actually unlocks it. The
 * redirect route enforces this server-side regardless of what this banner
 * says, so it's purely informational.
 */
export function ActivationBanner() {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center">
      <p className="text-sm text-blue-800">
        <strong>Not live yet.</strong> Your configuration is saved, but your ReviewTap link won&apos;t
        redirect real visitors until you have an active subscription. Nothing you set up here will be
        lost in the meantime.
      </p>
      <Link href="/dashboard/billing" className="btn-primary shrink-0">
        Activate with a subscription
      </Link>
    </div>
  );
}
