import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <Logo className="text-sm text-gray-500" />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-ink-900">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink-900">
            Terms
          </Link>
          <Link href="/cookies" className="hover:text-ink-900">
            Cookies
          </Link>
        </nav>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} ReviewTap</p>
      </Container>
    </footer>
  );
}
