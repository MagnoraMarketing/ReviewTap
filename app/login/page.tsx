import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <Link href="/" className="mb-8">
        <Logo className="text-lg" />
      </Link>
      <div className="w-full max-w-sm">
        <div className="card">
          <h1 className="text-xl font-semibold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Log in to manage your ReviewTap.</p>
          <Suspense>
            <LoginForm next={searchParams.next} />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
