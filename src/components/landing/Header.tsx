import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export function LandingHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/">
          <Logo className="text-base" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#how-it-works" className="hover:text-ink-900">
            How it works
          </a>
          <a href="#features" className="hover:text-ink-900">
            Features
          </a>
          <a href="#pricing" className="hover:text-ink-900">
            Pricing
          </a>
          <a href="#faq" className="hover:text-ink-900">
            FAQ
          </a>
          <Link href="/blog" className="hover:text-ink-900">
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-ink-900">
                Log in
              </Link>
              <Link href="/shop" className="btn-primary">
                Get ReviewTap – €50
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
