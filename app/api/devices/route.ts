import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceNameSchema, DEVICE_PLANS } from "@/lib/validation";
import { DEVICE_LIMIT_BY_PLAN } from "@/lib/display";
import { generateDevicePublicId } from "@/lib/utils";

const createDeviceSchema = z.object({
  name: deviceNameSchema.optional(),
  // Which visitor-facing style to configure: BASIC (single destination) or
  // PRO (multi-platform chooser). Free of charge to pick and preview either
  // one - this only decides which config UI applies, not whether the link
  // actually works for real visitors (that always depends on having an
  // active subscription, checked server-side on every redirect). Once the
  // account subscribes, the Stripe webhook syncs every device's plan to the
  // subscription actually paid for.
  plan: z.enum(DEVICE_PLANS).optional(),
});

/**
 * Self-service device creation: lets anyone signed in register a ReviewTap
 * (their own NFC tag/QR code, or just to configure and preview the product)
 * without buying a physical card from /shop or having a subscription yet.
 * Configuring is always free; only the redirect route's subscription check
 * decides whether the link actually does anything for a real visitor - see
 * get_redirect_target / src/lib/redirect-target.ts. The device-count limit
 * still applies (defaulting to the Basic limit for accounts with no
 * subscription yet), since it's the plan's device *allowance*, not a
 * payment gate on configuring.
 */
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = createDeviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const accountPlan = currentUser.subscription?.plan ?? "BASIC";
  const limit = DEVICE_LIMIT_BY_PLAN[accountPlan];
  const devicePlan = parsed.data.plan ?? "BASIC";

  const { count } = await supabase
    .from("devices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", currentUser.id);

  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      {
        error:
          accountPlan === "BASIC"
            ? `You've reached the ${limit}-device limit for the Basic plan. Upgrade to Pro for up to ${DEVICE_LIMIT_BY_PLAN.PRO} devices.`
            : `You've reached the ${limit}-device limit for the Pro plan.`,
      },
      { status: 403 },
    );
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const publicId = generateDevicePublicId();
    const { data, error } = await supabase
      .from("devices")
      .insert({
        user_id: currentUser.id,
        public_id: publicId,
        name: parsed.data.name?.trim() || "My ReviewTap",
        variant: "STANDEE_CARD",
        plan: devicePlan,
        status: "ACTIVE",
        destination_type: "GOOGLE_REVIEWS",
        destination_url: null,
        destinations: [],
        stripe_checkout_session_id: null,
      })
      .select()
      .single();

    if (!error) {
      return NextResponse.json({ device: data }, { status: 201 });
    }
    // Unique violation on public_id (extremely unlikely) - retry with a new one.
    if (error.code !== "23505") {
      console.error("Failed to create self-service device", error);
      return NextResponse.json({ error: "Couldn't create device." }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Couldn't create device. Please try again." }, { status: 500 });
}
