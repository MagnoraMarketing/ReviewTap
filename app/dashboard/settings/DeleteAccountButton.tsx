"use client";

import { useState, useTransition } from "react";

export function DeleteAccountButton({ email }: { email: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete your ReviewTap account (${email})? This permanently removes your profile, ` +
        "subscription record, devices, scan history and feedback. Your physical NFC tags and QR " +
        "codes will stop working immediately. This cannot be undone.",
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Couldn't delete your account.");
        return;
      }
      await fetch("/auth/signout", { method: "POST" });
      window.location.href = "/";
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
        {isPending ? "Deleting…" : "Delete my account"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
