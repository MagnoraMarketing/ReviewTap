import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Polled by the onboarding wizard while it waits for the Stripe webhook to
// provision the device after checkout completes.
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: device } = await supabase
    .from("devices")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ device: device ?? null });
}
