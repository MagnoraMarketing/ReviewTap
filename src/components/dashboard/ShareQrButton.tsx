"use client";

import { useState } from "react";

/**
 * Native "Share" for the QR image itself (not just the link) - lets an owner
 * send the actual QR code straight to WhatsApp/Email/AirDrop/etc. without
 * first downloading it and manually attaching the file. Falls back to a
 * plain download wherever the Web Share API or its `files` support is
 * missing (most desktop browsers), since that's still "save it".
 */
export function ShareQrButton({
  qrUrl,
  filename,
  title,
}: {
  qrUrl: string;
  filename: string;
  title: string;
}) {
  const [status, setStatus] = useState<"idle" | "busy" | "error">("idle");

  async function handleClick() {
    setStatus("busy");
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title });
        setStatus("idle");
        return;
      }

      // No file-sharing support (most desktop browsers) - fall back to a
      // plain download, same as the "Download" buttons next to this one.
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(objectUrl);
      setStatus("idle");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("idle"); // User cancelled the native share sheet.
        return;
      }
      setStatus("error");
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={status === "busy"} className="btn-secondary">
        {status === "busy" ? "Preparing…" : "Share QR"}
      </button>
      {status === "error" && <p className="mt-1 text-xs text-red-600">Couldn&apos;t share the QR code.</p>}
    </div>
  );
}
