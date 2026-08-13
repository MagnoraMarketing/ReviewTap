"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState } from "../login/actions";

export type { AuthActionState };

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const businessName = String(formData.get("business_name") ?? "").trim();

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: { business_name: businessName || null },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: "Couldn't create your account. Please try again." };
  }

  if (businessName && data.user) {
    await supabase
      .from("profiles")
      .update({ business_name: businessName })
      .eq("id", data.user.id);
  }

  if (data.session) {
    redirect("/shop");
  }

  return {
    message: "Account created. Please check your email to confirm your address, then log in.",
  };
}
