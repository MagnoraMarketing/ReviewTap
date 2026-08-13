"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import type { DeviceStatus } from "@/types/database";

export function DeviceStatusToggle({ deviceId, status }: { deviceId: string; status: DeviceStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status === "SUSPENDED") return null;

  const nextStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
  const label = status === "ACTIVE" ? "Pause" : "Activate";

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await fetch(`/api/devices/${deviceId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: nextStatus }),
            });
            if (!res.ok) {
              setError("Couldn't update device status.");
              return;
            }
            router.refresh();
          });
        }}
      >
        {isPending ? "Saving…" : label}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
