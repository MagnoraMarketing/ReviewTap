"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <Link href="/">
        <Logo className="text-lg" />
      </Link>
      <div className="card max-w-sm">
        <h1 className="text-xl font-semibold text-ink-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-gray-500">
          An unexpected error occurred. Please try again — if the problem persists, contact support.
        </p>
        <button type="button" onClick={reset} className="btn-primary mt-6 w-full">
          Try again
        </button>
      </div>
    </div>
  );
}
