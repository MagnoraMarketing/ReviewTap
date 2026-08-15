"use client";

import { useState } from "react";
import { PLAN_LABELS, PLAN_PRICE_EUR } from "@/lib/display";
import type { DevicePlan } from "@/types/database";

const PLANS: DevicePlan[] = ["BASIC", "PRO"];

export function AddAppCard() {
  const [plan, setPlan] = useState<DevicePlan>("BASIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <p className="text-sm text-gray-500">
        Your ReviewTap is configured, but it isn&apos;t live yet — activate it with a subscription so
        it actually redirects real visitors and starts recording statistics. Nothing you&apos;ve set
        up will be lost while you decide.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {PLANS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlan(p)}
            className={`rounded-xl border p-3 text-left text-sm transition-colors ${
              plan === p ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="font-semibold text-ink-900">{PLAN_LABELS[p]}</span>
            <span className="ml-1 text-gray-400">€{PLAN_PRICE_EUR[p]}/mo</span>
          </button>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        className="btn-primary mt-4"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await fetch("/api/checkout/add-app", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan }),
            });
            const body = await res.json();
            if (!res.ok || !body.url) {
              setError(body.error ?? "Couldn't start checkout.");
              setLoading(false);
              return;
            }
            window.location.href = body.url;
          } catch {
            setError("Couldn't start checkout.");
            setLoading(false);
          }
        }}
      >
        {loading ? "Starting checkout…" : `Add the app — €${PLAN_PRICE_EUR[plan]}/mo`}
      </button>
    </div>
  );
}
