import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "@/lib/current-user";

/**
 * Defense-in-depth check for admin pages/actions. Middleware already blocks
 * non-admins from /admin/*, but every admin data access re-checks here too
 * rather than trusting the request ever routed through middleware.
 */
export async function requireAdminUser(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/admin");
  if (currentUser.profile?.role !== "ADMIN") redirect("/dashboard");
  return currentUser;
}
