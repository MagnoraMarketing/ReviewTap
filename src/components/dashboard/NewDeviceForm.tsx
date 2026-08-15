"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PLAN_LABELS } from "@/lib/display";
import type { DevicePlan } from "@/types/database";

const PLAN_STYLE_DESCRIPTIONS: Record<DevicePlan, string> = {
  BASIC: "One fixed destination, direct redirect.",
  PRO: "Visitors pick their platform from a chooser page.",
};

export function NewDeviceForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<DevicePlan>("BASIC");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await fetch("/api/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.trim() || undefined, plan }),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(body.error ?? "Couldn't create device.");
            return;
          }
          router.push(`/dashboard/devices/${body.device.id}/nfc-setup`);
        });
      }}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-medium text-ink-900" htmlFor="device-name">
          Device name
        </label>
        <input
          id="device-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Front Desk"
          maxLength={100}
          className="input mt-1"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-ink-900">Style to configure</span>
        <p className="text-xs text-gray-400">
          Free to configure and preview either one — this doesn&apos;t decide what you pay, only
          which setup screens you see. Your final plan follows whichever subscription you activate.
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(["BASIC", "PRO"] as const).map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer flex-col gap-0.5 rounded-xl border p-3 text-sm transition-colors ${
                plan === option ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-2 font-medium text-ink-900">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === option}
                  onChange={() => setPlan(option)}
                  className="h-4 w-4 accent-brand-600"
                />
                {PLAN_LABELS[option]}
              </span>
              <span className="pl-6 text-xs text-gray-400">{PLAN_STYLE_DESCRIPTIONS[option]}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create device"}
      </Button>
      <p className="text-xs text-gray-400">
        Creates a permanent ReviewTap link and QR code you can configure and preview right away —
        next you&apos;ll connect your NFC tag (or skip that and just print the QR code). It won&apos;t
        redirect real visitors until you have an active subscription.
      </p>
    </form>
  );
}
