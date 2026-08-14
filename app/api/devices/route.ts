import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { deviceNameSchema } from "@/lib/validation";
import { DEVICE_LIMIT_BY_PLAN } from "@/lib/display";
import { generateDevicePublicId } from "@/lib/utils";

const createDeviceSchema = z.object({
  name: deviceNameSchema.optional(),
});

/**
 * Self-service device creation: lets an owner register their own NFC tag or
 * QR code without buying a physical card from /shop. Gated on an active
 * subscription and the plan's device limit - unlike the shop's soft warning,
 * this is a hard limit, since a subscription is the only thing that governs
 * cost for a device that wasn't bought as hardware.
 */
export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!currentUser.hasActiveSubscription) {
    return NextResponse.json(
      { error: "An active ReviewTap subscription is required to add a device." },
      { status: 403 },
    );
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
  const plan = currentUser.subscription!.plan;
  const limit = DEVICE_LIMIT_BY_PLAN[plan];

  const { count } = await supabase
    .from("devices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", currentUser.id);

  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      {
        error:
          plan === "BASIC"
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
        plan,
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
