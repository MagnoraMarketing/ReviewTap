import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <Link href="/" className="mb-8">
        <Logo className="text-lg" />
      </Link>
      <div className="w-full max-w-sm">
        <div className="card">
          <h1 className="text-xl font-semibold text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set up your account, then choose your ReviewTap device.
          </p>
          <SignupForm />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
