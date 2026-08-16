import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { attachFeedbackMessageSchema } from "@/lib/validation";

const ID_PATTERN = /^[0-9a-f-]{36}$/i;

/**
 * Lets a guest attach a free-text message to a feedback row shortly after
 * submitting their star rating (see POST /api/feedback). Public and
 * unauthenticated like the rating itself - the feedback id is an unguessable
 * UUID the guest's browser just received, not something discoverable.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`feedback-message:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!ID_PATTERN.test(params.id)) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = attachFeedbackMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin
    .from("feedback")
    .update({ message: parsed.data.message })
    .eq("id", params.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
