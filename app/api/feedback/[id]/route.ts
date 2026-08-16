import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateFeedbackStatusSchema } from "@/lib/validation";

/**
 * Lets a signed-in device owner (or admin) mark a piece of guest feedback as
 * Read/Resolved. Runs through the RLS-scoped client, not the service role -
 * `feedback_update_owner_or_admin` only matches rows on devices the caller
 * owns, and `feedback_protect_privileged_columns` (0003_feedback.sql) pins
 * rating/message/device_id back to their prior value for anyone but the
 * service role, so this can only ever change `status`.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateFeedbackStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("feedback")
    .update({ status: parsed.data.status })
    .eq("id", params.id)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
