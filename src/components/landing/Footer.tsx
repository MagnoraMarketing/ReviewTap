import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";

const PLATFORM_LINKS = [
  { href: "/google-reviews", label: "Google Reviews" },
  { href: "/trustpilot-reviews", label: "Trustpilot" },
  { href: "/facebook-reviews", label: "Facebook" },
  { href: "/tripadvisor-reviews", label: "Tripadvisor" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div>
          <Logo className="text-sm text-gray-500" />
          <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} ReviewTap</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Get more reviews on</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-gray-500">
            {PLATFORM_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink-900">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Company</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-gray-500">
            <Link href="/login" className="hover:text-ink-900">
              Log in
            </Link>
            <Link href="/blog" className="hover:text-ink-900">
              Blog
            </Link>
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
        </div>
      </Container>
    </footer>
  );
}
