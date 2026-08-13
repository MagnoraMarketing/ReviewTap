import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client. Bypasses RLS entirely.
 *
 * SECURITY: `server-only` guarantees this module (and therefore the service
 * role key) can never be pulled into a client bundle. Only import this from
 * API routes / server actions that perform their own authorization checks
 * (webhooks, admin routes, the redirect endpoint).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
