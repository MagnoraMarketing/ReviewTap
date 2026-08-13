import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { requireAdminUser } from "@/lib/require-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-ink-900">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo className="text-base text-white" />
            <span className="badge bg-white/10 text-white">Admin</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
            Back to my dashboard
          </Link>
        </Container>
      </header>

      <Container className="grid grid-cols-1 gap-8 py-8 md:grid-cols-[200px_1fr]">
        <aside className="md:sticky md:top-8 md:self-start">
          <nav className="flex flex-col gap-1">
            <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-ink-900">
              Overview
            </Link>
            <Link href="/admin/users" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-ink-900">
              Users
            </Link>
            <Link href="/admin/devices" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-ink-900">
              Devices
            </Link>
            <Link href="/admin/products" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-ink-900">
              Products
            </Link>
          </nav>
        </aside>
        <main>{children}</main>
      </Container>
    </div>
  );
}
