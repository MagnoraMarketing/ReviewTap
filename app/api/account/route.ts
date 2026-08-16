import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GDPR self-service account deletion. Deletes the auth.users row via the
 * admin API - `profiles.id` (and everything chained from it: subscriptions,
 * devices, scans, feedback) references `auth.users(id) on delete cascade`,
 * so this one call is enough to remove all of the account's data.
 */
export async function DELETE() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("Failed to delete account", error);
    return NextResponse.json({ error: "Couldn't delete your account." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
