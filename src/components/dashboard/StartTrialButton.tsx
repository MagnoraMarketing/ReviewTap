"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

/**
 * Self-service, one-time free trial - unlocks the full Pro experience
 * (live redirects, multi-platform chooser, stats) with no payment, for any
 * account that hasn't already used one or subscribed for real. See
 * app/api/trial/route.ts for the server-side one-time guard.
 */
export function StartTrialButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        className="btn-primary"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await fetch("/api/trial", { method: "POST" });
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              setError(body.error ?? "Couldn't start your free trial.");
              return;
            }
            router.refresh();
          });
        }}
      >
        {isPending ? "Starting…" : "Start free trial — no payment"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
