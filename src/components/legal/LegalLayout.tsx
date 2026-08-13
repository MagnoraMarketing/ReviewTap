import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/landing/Footer";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="border-b border-gray-100">
        <Container className="flex h-16 items-center">
          <Link href="/">
            <Logo className="text-base" />
          </Link>
        </Container>
      </header>
      <Container className="max-w-3xl py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated {updated}</p>
        <div className="prose-legal mt-10 space-y-6 text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </Container>
      <Footer />
    </div>
  );
}
