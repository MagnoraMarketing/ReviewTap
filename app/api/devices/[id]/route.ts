import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { updateDestinationSchema, updateDestinationsSchema, deviceNameSchema } from "@/lib/validation";

const patchSchema = z.union([
  updateDestinationSchema,
  updateDestinationsSchema,
  z.object({ status: z.enum(["ACTIVE", "PAUSED"]) }),
  z.object({ name: deviceNameSchema }),
]);

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  // Users may only ever set their own device to ACTIVE/PAUSED, never
  // SUSPENDED - that's an admin-only action performed via /admin.
  const { data, error } = await supabase
    .from("devices")
    .update(parsed.data)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  return NextResponse.json({ device: data });
}
