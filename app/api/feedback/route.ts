import { NextResponse, type NextRequest } from "next/server";
import { getRedirectTarget } from "@/lib/redirect-target";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { submitFeedbackSchema } from "@/lib/validation";

/**
 * Records a guest's star rating (and optional message) from the Pro chooser
 * page. Guests are never authenticated, so this is a public, rate-limited
 * endpoint gated only by a valid, active device's public_id - the same trust
 * model as the redirect routes. See RatingFeedback.tsx: the rating is posted
 * as soon as a star is picked, independent of whether the guest goes on to
 * leave a public review, so it's never lost.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`feedback:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const target = await getRedirectTarget(parsed.data.publicId.toUpperCase());
  if (!target || target.deviceStatus !== "ACTIVE" || !target.subscriptionActive) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .insert({
      device_id: target.deviceId,
      rating: parsed.data.rating,
      message: parsed.data.message?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to record feedback", error);
    return NextResponse.json({ error: "Couldn't record feedback." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
