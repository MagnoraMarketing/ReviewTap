import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEVICE_PLANS } from "@/lib/validation";
import { TEST_SUBSCRIPTION_CUSTOMER_PREFIX } from "@/lib/admin-test-subscription";

const grantSchema = z.object({ plan: z.enum(DEVICE_PLANS).default("PRO") });

async function requireAdmin(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ADMIN") return null;
  return user;
}

/**
 * Admin-only: grants a fake "active" subscription for a chosen user so the
 * paid experience (device limits, activation, stats) can be tried end-to-end
 * without going through real Stripe checkout. Deliberately bypasses Stripe
 * entirely rather than routing through it - the rest of the app already
 * only ever reads `subscriptions.status`/`plan`, so this needs no other
 * code changes and is fully reversible via the matching DELETE below.
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = grantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const now = new Date();
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        user_id: params.id,
        stripe_customer_id: `${TEST_SUBSCRIPTION_CUSTOMER_PREFIX}${params.id}`,
        stripe_subscription_id: null,
        plan: parsed.data.plan,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: oneYearFromNow.toISOString(),
        cancel_at_period_end: false,
      },
      { onConflict: "stripe_customer_id" },
    )
    .select()
    .single();

  if (error || !data) {
    console.error("Failed to grant test subscription", error);
    return NextResponse.json({ error: "Couldn't grant test subscription." }, { status: 500 });
  }

  return NextResponse.json({ subscription: data });
}

/** Admin-only: revokes a test grant created by the POST handler above. */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from("subscriptions")
    .delete()
    .eq("user_id", params.id)
    .like("stripe_customer_id", `${TEST_SUBSCRIPTION_CUSTOMER_PREFIX}%`);

  if (error) {
    console.error("Failed to revoke test subscription", error);
    return NextResponse.json({ error: "Couldn't revoke test subscription." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
