"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema, updateBrandingSchema } from "@/lib/validation";

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

export async function updateBranding(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in first." };

  const parsed = updateBrandingSchema.safeParse({
    logo_url: formData.get("logo_url"),
    accent_color: formData.get("accent_color"),
    welcome_message: formData.get("welcome_message"),
    thank_you_message: formData.get("thank_you_message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      logo_url: parsed.data.logo_url || null,
      accent_color: parsed.data.accent_color || null,
      welcome_message: parsed.data.welcome_message || null,
      thank_you_message: parsed.data.thank_you_message || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Couldn't save your branding." };
  }

  revalidatePath("/dashboard/settings");
  return { message: "Branding saved." };
}
