import Link from "next/link";
import type { SubscriptionStatus } from "@/types/database";

const NEEDS_ATTENTION: Partial<Record<SubscriptionStatus, string>> = {
  past_due: "Your last payment failed. Please update your billing details to keep ReviewTap active.",
  unpaid: "Your subscription is unpaid. Your ReviewTap link will stop working until this is resolved.",
  canceled: "Your subscription has been canceled. Reactivate to bring your ReviewTap link back online.",
  incomplete: "Your subscription setup wasn't completed. Please finish checkout to activate ReviewTap.",
  incomplete_expired: "Your checkout session expired before payment completed. Please subscribe again.",
  paused: "Your subscription is paused. Reactivate to bring your ReviewTap link back online.",
};

export function SubscriptionBanner({ status }: { status: SubscriptionStatus | undefined }) {
  if (!status || !(status in NEEDS_ATTENTION)) return null;

  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
      <p className="text-sm text-amber-800">{NEEDS_ATTENTION[status]}</p>
      <Link href="/dashboard/billing" className="btn-primary shrink-0">
        Manage billing
      </Link>
    </div>
  );
}
