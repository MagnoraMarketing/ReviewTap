"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FEEDBACK_STATUS_LABELS } from "@/lib/display";
import { FEEDBACK_STATUSES } from "@/lib/validation";
import type { FeedbackStatus } from "@/types/database";

export function FeedbackStatusControl({ id, status }: { id: string; status: FeedbackStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => {
          const nextStatus = e.target.value as FeedbackStatus;
          setError(null);
          startTransition(async () => {
            const res = await fetch(`/api/feedback/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: nextStatus }),
            });
            if (!res.ok) {
              setError("Couldn't update status.");
              return;
            }
            router.refresh();
          });
        }}
        className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        {FEEDBACK_STATUSES.map((value) => (
          <option key={value} value={value}>
            {FEEDBACK_STATUS_LABELS[value]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
