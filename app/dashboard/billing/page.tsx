import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { ManageBillingButton } from "@/components/dashboard/ManageBillingButton";
import { AddAppCard } from "@/components/dashboard/AddAppCard";
import { SUBSCRIPTION_STATUS_LABELS, SUBSCRIPTION_STATUS_TONE } from "@/lib/display";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard/billing");

  const subscription = currentUser.subscription;

  let hasDevice = false;
  if (!subscription) {
    const supabase = createClient();
    const { count } = await supabase
      .from("devices")
      .select("id", { count: "exact", head: true })
      .eq("user_id", currentUser.id);
    hasDevice = (count ?? 0) > 0;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Billing</h1>
      <p className="mt-1 text-sm text-gray-500">
        Your ReviewTap account itself is free — a subscription only charges for the months your
        device is active, and you can cancel anytime. Manage it and view invoices via Stripe below.
      </p>

      <div className="card mt-6">
        {subscription ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge tone={SUBSCRIPTION_STATUS_TONE[subscription.status]} className="mt-1">
                  {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
                </Badge>
              </div>
              <ManageBillingButton />
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-gray-400">Current period start</dt>
                <dd className="text-sm text-ink-900">
                  {subscription.current_period_start ? formatDate(subscription.current_period_start) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Current period end</dt>
                <dd className="text-sm text-ink-900">
                  {subscription.current_period_end ? formatDate(subscription.current_period_end) : "—"}
                </dd>
              </div>
              {subscription.cancel_at_period_end && (
                <div className="sm:col-span-2">
                  <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    Your subscription will end on{" "}
                    {subscription.current_period_end ? formatDate(subscription.current_period_end) : "the current period end"}
                    . Reactivate anytime from the billing portal before then.
                  </p>
                </div>
              )}
            </dl>
          </>
        ) : hasDevice ? (
          <div className="py-4">
            <AddAppCard />
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              You don&apos;t have a ReviewTap subscription yet — your account itself stays free
              either way.
            </p>
            <a href="/shop" className="btn-primary mt-4 inline-flex">
              Get ReviewTap
            </a>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        ReviewTap uses Stripe for secure billing — invoices, payment methods and cancellation are
        all managed inside the Stripe Customer Portal.
      </p>
    </div>
  );
}
