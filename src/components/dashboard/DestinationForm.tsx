"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { DESTINATION_LABELS, DESTINATION_PLACEHOLDERS } from "@/lib/display";
import type { DestinationType } from "@/types/database";

const OPTIONS: DestinationType[] = ["GOOGLE_REVIEWS", "TRUSTPILOT", "TRIPADVISOR", "CUSTOM_URL"];

export function DestinationForm({
  deviceId,
  initialType,
  initialUrl,
}: {
  deviceId: string;
  initialType: DestinationType;
  initialUrl: string | null;
}) {
  const router = useRouter();
  const [type, setType] = useState<DestinationType>(initialType);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        startTransition(async () => {
          const res = await fetch(`/api/devices/${deviceId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination_type: type, destination_url: url }),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(body.error ?? "Couldn't save destination.");
            return;
          }
          setSuccess(`Your ReviewTap is now sending customers to ${DESTINATION_LABELS[type]}.`);
          router.refresh();
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
              type === option ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="destination_type"
              value={option}
              checked={type === option}
              onChange={() => setType(option)}
              className="h-4 w-4 accent-brand-600"
            />
            <span className="font-medium text-ink-900">{DESTINATION_LABELS[option]}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="label" htmlFor="destination_url">
          {DESTINATION_LABELS[type]} URL
        </label>
        <input
          id="destination_url"
          name="destination_url"
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={DESTINATION_PLACEHOLDERS[type]}
          className="input"
        />
        <p className="mt-1 text-xs text-gray-400">Must be a secure https:// link.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save destination"}
      </Button>
      <p className="text-xs text-gray-400">
        Your physical NFC chip and QR code don&apos;t need to change — only the destination updates.
      </p>
    </form>
  );
}
