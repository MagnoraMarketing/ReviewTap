import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard");

  const isAdmin = currentUser.profile?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/dashboard">
            <Logo className="text-base" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-500 sm:inline">
              {currentUser.profile?.business_name ?? currentUser.email}
            </span>
            <LanguageSwitcher />
            <form action="/auth/signout" method="POST">
              <button type="submit" className="btn-ghost text-sm">
                Log out
              </button>
            </form>
          </div>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-8 py-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-8 md:self-start">
          <DashboardNav isAdmin={isAdmin} />
        </aside>
        <main>{children}</main>
      </Container>
    </div>
  );
}
