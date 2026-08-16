import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GDPR self-service data export: everything ReviewTap holds tied to this
 * account, as a single JSON download. RLS-scoped client - a signed-in user
 * can only ever see their own rows here anyway, this just packages them up.
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: devices } = await supabase.from("devices").select("*").eq("user_id", user.id);
  const deviceIds = (devices ?? []).map((d) => d.id);

  const [{ data: profile }, { data: subscriptions }, { data: scans }, { data: feedback }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("subscriptions").select("*").eq("user_id", user.id),
      deviceIds.length
        ? supabase.from("scans").select("*").in("device_id", deviceIds)
        : Promise.resolve({ data: [] }),
      deviceIds.length
        ? supabase.from("feedback").select("*").in("device_id", deviceIds)
        : Promise.resolve({ data: [] }),
    ]);

  const body = {
    exported_at: new Date().toISOString(),
    account_email: user.email,
    profile,
    subscriptions: subscriptions ?? [],
    devices: devices ?? [],
    scans: scans ?? [],
    feedback: feedback ?? [],
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Disposition": 'attachment; filename="reviewtap-data-export.json"',
    },
  });
}
