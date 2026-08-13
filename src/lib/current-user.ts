import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSubscriptionStatusActive } from "@/lib/stripe";
import type { Profile, Subscription } from "@/types/database";

export interface CurrentUser {
  id: string;
  email: string;
  profile: Profile | null;
  subscription: Subscription | null;
  hasActiveSubscription: boolean;
}

/**
 * Loads the signed-in user plus profile + subscription in one place so
 * every server component/page shares the same "is this account active"
 * logic instead of re-deriving it.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [{ data: profile }, { data: subscription }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    id: user.id,
    email: user.email ?? "",
    profile: profile ?? null,
    subscription: subscription ?? null,
    hasActiveSubscription: isSubscriptionStatusActive(subscription?.status),
  };
}
