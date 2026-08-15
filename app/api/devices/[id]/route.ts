import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

/**
 * Lets an owner delete their own device - e.g. to swap a lost/broken NFC
 * card or QR sticker for a new one without needing to upgrade plans first
 * (the device-limit check on creation is a live count, so freeing up a slot
 * here just works). This permanently deletes the device's scan history too
 * (`scans.device_id` cascades), which the client is expected to warn about
 * before calling this.
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS (devices_select_own_or_admin) only returns this row if the caller
  // owns the device; the user_id check below additionally excludes admins
  // acting on someone else's device, since this is a self-service endpoint,
  // not the admin panel. There's no delete policy for regular users (see
  // supabase/migrations/0001_init.sql), so the actual delete runs through
  // the admin client once ownership is confirmed here.
  const { data: device } = await supabase
    .from("devices")
    .select("id, user_id")
    .eq("id", params.id)
    .maybeSingle();

  if (!device || device.user_id !== user.id) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  const supabaseAdmin = createAdminClient();
  const { error: deleteError } = await supabaseAdmin.from("devices").delete().eq("id", device.id);

  if (deleteError) {
    console.error("Failed to delete device", deleteError);
    return NextResponse.json({ error: "Couldn't delete device." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
