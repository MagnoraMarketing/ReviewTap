"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DeviceNameForm({ deviceId, initialName }: { deviceId: string; initialName: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(false);
        startTransition(async () => {
          const res = await fetch(`/api/devices/${deviceId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          });
          if (res.ok) {
            setSaved(true);
            router.refresh();
          }
        });
      }}
      className="flex items-center gap-2"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input max-w-xs"
        aria-label="Device name"
      />
      <button type="submit" className="btn-secondary shrink-0" disabled={isPending}>
        {isPending ? "Saving…" : "Rename"}
      </button>
      {saved && <span className="text-xs text-emerald-600">Saved</span>}
    </form>
  );
}
