import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <Link href="/">
        <Logo className="text-lg" />
      </Link>
      <div className="card max-w-sm">
        <p className="text-sm font-semibold text-brand-600">404</p>
        <h1 className="mt-1 text-xl font-semibold text-ink-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link href="/" className="btn-primary mt-6 w-full">
          Back to home
        </Link>
      </div>
    </div>
  );
}
