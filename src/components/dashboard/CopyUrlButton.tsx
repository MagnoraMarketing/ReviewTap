"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CopyUrlButton({ url, label = "Copy URL" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      {copied ? "Copied!" : label}
    </Button>
  );
}
