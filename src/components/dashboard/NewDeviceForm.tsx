"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function NewDeviceForm() {
  const router = useRouter();
  const [name, setName] = useState("");
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
            body: JSON.stringify({ name: name.trim() || undefined }),
          });
          const body = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(body.error ?? "Couldn't create device.");
            return;
          }
          router.push(`/dashboard/devices/${body.device.id}`);
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
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create device"}
      </Button>
      <p className="text-xs text-gray-400">
        Creates a permanent ReviewTap link and QR code. Write it to your own NFC tag from{" "}
        <span className="font-medium">Dashboard → NFC setup</span> afterwards, or print the QR code.
      </p>
    </form>
  );
}
