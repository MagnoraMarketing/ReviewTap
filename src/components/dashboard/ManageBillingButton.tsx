"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ManageBillingButton({ label = "Manage billing" }: { label?: string }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        type="button"
        disabled={isPending}
        onClick={async () => {
          setIsPending(true);
          setError(null);
          try {
            const res = await fetch("/api/billing/portal", { method: "POST" });
            const body = await res.json();
            if (!res.ok || !body.url) {
              setError(body.error ?? "Couldn't open billing portal.");
              setIsPending(false);
              return;
            }
            window.location.href = body.url;
          } catch {
            setError("Couldn't open billing portal.");
            setIsPending(false);
          }
        }}
      >
        {isPending ? "Opening…" : label}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
