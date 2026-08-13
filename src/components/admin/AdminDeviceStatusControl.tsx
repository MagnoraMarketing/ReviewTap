"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { DeviceStatus } from "@/types/database";

const NEXT_ACTIONS: Record<DeviceStatus, { label: string; nextStatus: DeviceStatus }[]> = {
  ACTIVE: [{ label: "Suspend", nextStatus: "SUSPENDED" }, { label: "Pause", nextStatus: "PAUSED" }],
  PAUSED: [{ label: "Reactivate", nextStatus: "ACTIVE" }, { label: "Suspend", nextStatus: "SUSPENDED" }],
  SUSPENDED: [{ label: "Reactivate", nextStatus: "ACTIVE" }],
};

export function AdminDeviceStatusControl({ deviceId, status }: { deviceId: string; status: DeviceStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {NEXT_ACTIONS[status].map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={isPending}
          className="btn-secondary text-xs"
          onClick={() => {
            startTransition(async () => {
              await fetch(`/api/admin/devices/${deviceId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action.nextStatus }),
              });
              router.refresh();
            });
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
