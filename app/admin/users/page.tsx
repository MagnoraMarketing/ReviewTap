import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/require-admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  await requireAdminUser();
  const supabase = createClient();
  const q = searchParams.q?.trim();

  let query = supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (q) {
    query = query.or(`email.ilike.%${q}%,business_name.ilike.%${q}%`);
  }

  const { data: users } = await query;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Users</h1>

      <form className="mt-4" method="GET">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by email or business name…"
          className="input max-w-sm"
        />
      </form>

      <div className="card mt-4 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(users ?? []).map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${user.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                    {user.business_name || "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-gray-600">{user.role}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(user.created_at)}</td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
