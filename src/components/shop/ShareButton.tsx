"use client";

import { useState } from "react";

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn-secondary w-full"
      onClick={async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
            return;
          } catch {
            // User cancelled the native share sheet - fall through to copy.
          }
        }
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? "Link copied!" : "Share this page"}
    </button>
  );
}
