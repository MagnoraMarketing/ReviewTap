import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Link unavailable", robots: { index: false } };

type Reason = "not-found" | "paused" | "suspended" | "subscription" | "not-configured" | "error";

const COPY: Record<Reason, { title: string; body: string; ownerNote?: string }> = {
  "not-found": {
    title: "This ReviewTap link doesn't exist",
    body: "We couldn't find a review link matching this code. Double-check the NFC card or QR code and try again.",
  },
  paused: {
    title: "This ReviewTap is paused",
    body: "The business owner has temporarily paused this review link.",
    ownerNote: "For the business owner: reactivate this device from Dashboard → Devices.",
  },
  suspended: {
    title: "This ReviewTap is unavailable",
    body: "This review link has been suspended.",
    ownerNote: "For the business owner: please contact support if you believe this is a mistake.",
  },
  subscription: {
    title: "ReviewTap is currently inactive",
    body: "This business's ReviewTap subscription isn't active right now, so this link can't redirect visitors yet.",
    ownerNote: "For the business owner: please renew your ReviewTap subscription to reactivate this review link.",
  },
  "not-configured": {
    title: "This ReviewTap isn't set up yet",
    body: "The business owner hasn't chosen a review destination for this link yet.",
    ownerNote: "For the business owner: choose a destination from Dashboard → Devices.",
  },
  error: {
    title: "Something went wrong",
    body: "We hit an unexpected error loading this review link. Please try again in a moment.",
  },
};

export default function RedirectStatusPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  const reason = (
    searchParams.reason && searchParams.reason in COPY ? searchParams.reason : "not-found"
  ) as Reason;
  const copy = COPY[reason];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center">
      <Link href="/" className="mb-10">
        <Logo className="text-lg" />
      </Link>
      <div className="card max-w-md">
        <h1 className="text-xl font-semibold text-ink-900">{copy.title}</h1>
        <p className="mt-3 text-sm text-gray-600">{copy.body}</p>
        {copy.ownerNote && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4 text-left text-sm text-gray-600">
            {copy.ownerNote}
          </div>
        )}
        {reason === "subscription" && (
          <Link href="/login?next=/dashboard/billing" className="btn-primary mt-6 w-full">
            Manage subscription
          </Link>
        )}
      </div>
    </div>
  );
}
