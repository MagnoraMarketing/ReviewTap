"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validation";

export interface SettingsActionState {
  error?: string;
  message?: string;
}

export async function updateProfile(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in first." };

  const parsed = updateProfileSchema.safeParse({
    business_name: formData.get("business_name"),
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      business_name: parsed.data.business_name || null,
      name: parsed.data.name || null,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Couldn't save your changes." };
  }

  revalidatePath("/dashboard/settings");
  return { message: "Settings saved." };
}
