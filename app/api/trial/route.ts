import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SELF_TRIAL_CUSTOMER_PREFIX } from "@/lib/admin-test-subscription";

/**
 * Self-service free trial: any signed-in user (existing or brand new) can
 * start one, once, without going through Stripe - it grants the same
 * "trialing" status the redirect check and hasActiveSubscription already
 * treat as active (see get_redirect_target / isSubscriptionStatusActive),
 * so every configured device actually goes live for real visitors while
 * they try the product. No expiry is set - it stays active until the
 * account subscribes for real or an admin revokes it from /admin/users/[id].
 */
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "You've already used your free trial or have a subscription on file." },
      { status: 409 },
    );
  }

  const now = new Date();
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      user_id: user.id,
      stripe_customer_id: `${SELF_TRIAL_CUSTOMER_PREFIX}${user.id}`,
      stripe_subscription_id: null,
      plan: "PRO",
      status: "trialing",
      current_period_start: now.toISOString(),
      current_period_end: null,
      cancel_at_period_end: false,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to start free trial", error);
    return NextResponse.json({ error: "Couldn't start your free trial." }, { status: 500 });
  }

  // Existing devices were configured before the trial started - bring them
  // up to the Pro (multi-platform) experience too, matching what the Stripe
  // webhook does for a real subscription, so old devices get the full trial
  // just like ones created after starting it.
  const { error: deviceError } = await supabaseAdmin
    .from("devices")
    .update({ plan: "PRO" })
    .eq("user_id", user.id);
  if (deviceError) {
    console.error("Failed to sync device plan after starting trial", deviceError);
  }

  return NextResponse.json({ subscription: data });
}
