"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { DESTINATION_LABELS, DESTINATION_PLACEHOLDERS } from "@/lib/display";
import { DESTINATION_TYPES } from "@/lib/validation";
import type { DestinationType, DeviceDestination } from "@/types/database";

function withDefaults(existing: DeviceDestination[]): Record<DestinationType, { url: string; enabled: boolean }> {
  const byType = new Map(existing.map((d) => [d.type, d]));
  const result = {} as Record<DestinationType, { url: string; enabled: boolean }>;
  for (const type of DESTINATION_TYPES) {
    const found = byType.get(type);
    result[type] = { url: found?.url ?? "", enabled: found?.enabled ?? false };
  }
  return result;
}

export function MultiDestinationForm({
  deviceId,
  initialDestinations,
  onSaved,
}: {
  deviceId: string;
  initialDestinations: DeviceDestination[];
  onSaved?: (destinations: DeviceDestination[]) => void;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(withDefaults(initialDestinations));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const destinations = DESTINATION_TYPES.map((type) => ({
          type,
          url: rows[type].url.trim(),
          enabled: rows[type].enabled,
        }));

        startTransition(async () => {
          const res = await fetch(`/api/devices/${deviceId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destinations }),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(body.error ?? "Couldn't save your destinations.");
            return;
          }
          setSuccess("Your ReviewTap chooser page is updated.");
          router.refresh();
          onSaved?.(destinations);
        });
      }}
      className="space-y-3"
    >
      {DESTINATION_TYPES.map((type) => (
        <div key={type} className="rounded-xl border border-gray-200 p-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={rows[type].enabled}
              onChange={(e) =>
                setRows((prev) => ({ ...prev, [type]: { ...prev[type], enabled: e.target.checked } }))
              }
              className="h-4 w-4 accent-brand-600"
            />
            <PlatformIcon type={type} className="h-7 w-7 text-xs" />
            <span className="font-medium text-ink-900">{DESTINATION_LABELS[type]}</span>
          </label>
          {rows[type].enabled && (
            <input
              type="url"
              value={rows[type].url}
              onChange={(e) =>
                setRows((prev) => ({ ...prev, [type]: { ...prev[type], url: e.target.value } }))
              }
              placeholder={DESTINATION_PLACEHOLDERS[type]}
              className="input mt-2"
            />
          )}
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save chooser page"}
      </Button>
      <p className="text-xs text-gray-400">
        Visitors who tap or scan will land on a page listing every platform you enable here, and can
        share that page too. Enable at least one platform with a valid URL.
      </p>
    </form>
  );
}
