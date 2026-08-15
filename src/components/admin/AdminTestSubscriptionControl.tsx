"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { DevicePlan } from "@/types/database";

/**
 * Lets an admin try the paid experience for a given account without going
 * through real Stripe checkout - grants a fake "active" subscription
 * (server-side, admin-only, see app/api/admin/users/[id]/test-subscription)
 * and revokes it again with one click. Only ever shown/enabled for
 * accounts that either have no subscription or already have one of these
 * test grants, so it can never be used to overwrite a real customer's
 * Stripe-backed subscription.
 */
export function AdminTestSubscriptionControl({
  userId,
  subscriptionKind,
}: {
  userId: string;
  /**
   * "none": no subscription row at all - safe to grant a test one.
   * "test": current row is a previous test grant - safe to revoke, or
   * re-grant with a different plan.
   * "real": a genuine Stripe-backed subscription exists - testing tools are
   * hidden entirely so this can never overwrite a paying customer's row.
   */
  subscriptionKind: "none" | "test" | "real";
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<DevicePlan>("PRO");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (subscriptionKind === "real") {
    return (
      <div className="mt-3 border-t border-gray-100 pt-3">
        <p className="text-xs font-medium text-gray-400">Testing tools</p>
        <p className="mt-2 text-xs text-gray-400">
          This account has a real Stripe subscription — testing tools are hidden to avoid conflicts.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <p className="text-xs font-medium text-gray-400">Testing tools</p>
      {subscriptionKind === "test" ? (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-amber-700">
            This is a test grant (not a real Stripe subscription) — remember to revoke it when
            you&apos;re done testing.
          </p>
          <button
            type="button"
            disabled={isPending}
            className="btn-secondary text-xs"
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const res = await fetch(`/api/admin/users/${userId}/test-subscription`, {
                  method: "DELETE",
                });
                if (!res.ok) {
                  setError("Couldn't revoke test subscription.");
                  return;
                }
                router.refresh();
              });
            }}
          >
            {isPending ? "Revoking…" : "Revoke test subscription"}
          </button>
        </div>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value as DevicePlan)}
            className="input w-auto py-1.5 text-xs"
          >
            <option value="PRO">Pro</option>
            <option value="BASIC">Basic</option>
          </select>
          <button
            type="button"
            disabled={isPending}
            className="btn-secondary text-xs"
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const res = await fetch(`/api/admin/users/${userId}/test-subscription`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan }),
                });
                if (!res.ok) {
                  setError("Couldn't grant test subscription.");
                  return;
                }
                router.refresh();
              });
            }}
          >
            {isPending ? "Granting…" : "Grant (test, no payment)"}
          </button>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
