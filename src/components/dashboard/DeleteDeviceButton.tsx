"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Deletes a device so its NFC tag/QR code slot can be replaced with a
 * different physical one, without needing to upgrade plans first - the
 * device-limit check on creation is a live count, so freeing this slot lets
 * a new device be added right after. Permanently deletes the device's scan
 * history too (cascades), which the confirmation below warns about.
 */
export function DeleteDeviceButton({ deviceId, deviceName }: { deviceId: string; deviceName: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${deviceName}"? This permanently removes this device and all of its scan history. ` +
        "The physical NFC tag or QR code will stop working immediately. You can add a different " +
        "NFC tag or QR code afterwards without upgrading, since this frees up its slot.",
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/devices/${deviceId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Couldn't delete device.");
        return;
      }
      router.push("/dashboard/devices");
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete this device"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
