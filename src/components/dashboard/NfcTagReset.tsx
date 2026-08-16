"use client";

import { useEffect, useRef, useState } from "react";
import {
  NFC_TIMEOUT_MS,
  NFC_TIMEOUT_MESSAGE,
  nfcErrorMessage,
  ReadyToScanVisual,
  ResetIcon,
  SuccessModal,
} from "@/components/dashboard/nfc-shared";

type ResetStatus = "idle" | "scanning" | "done" | "error";

/**
 * Erases whatever is written on a physical NFC chip, so it can be safely
 * reused for something else (or handed off) instead of still pointing at
 * this device's ReviewTap link. Purely a client-side Web NFC action - it
 * never touches this device's record, so it doesn't need a server round
 * trip the way deleting the device does.
 */
export function NfcTagReset() {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [status, setStatus] = useState<ResetStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const timedOutRef = useRef(false);

  useEffect(() => {
    setNfcSupported(typeof window !== "undefined" && "NDEFReader" in window);
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function handleReset() {
    setError(null);
    setStatus("scanning");
    timedOutRef.current = false;
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = window.setTimeout(() => {
      timedOutRef.current = true;
      controller.abort();
    }, NFC_TIMEOUT_MS);
    try {
      const ndef = new NDEFReader();
      await ndef.write({ records: [] }, { signal: controller.signal });
      setStatus("done");
      setShowSuccessModal(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (timedOutRef.current) {
          setStatus("error");
          setError(NFC_TIMEOUT_MESSAGE);
        } else {
          setStatus("idle");
        }
        return;
      }
      setStatus("error");
      setError(nfcErrorMessage(err));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function cancelReset() {
    abortRef.current?.abort();
  }

  if (!nfcSupported) {
    return (
      <p className="text-sm text-amber-700">
        Your browser doesn&apos;t support erasing NFC chips from a webpage (this needs Chrome on
        Android). Use a free NFC app instead — most have an &ldquo;Erase&rdquo; or &ldquo;Format
        tag&rdquo; option.
      </p>
    );
  }

  return (
    <div>
      {showSuccessModal && (
        <SuccessModal
          title="Tag Reset Successfully"
          subtitle="All data has been erased from the tag."
          onDone={() => setShowSuccessModal(false)}
        />
      )}

      {status === "idle" && (
        <button type="button" onClick={handleReset} className="btn-secondary border-amber-300 text-amber-800 hover:bg-amber-50">
          <ResetIcon className="h-4 w-4" />
          Reset NFC tag
        </button>
      )}

      {status === "scanning" && (
        <ReadyToScanVisual
          eyebrow="Resetting NFC…"
          hint="Move your phone slowly over the tag. All data on it will be erased — only writable tags can be reset."
          onCancel={cancelReset}
        />
      )}

      {status === "done" && !showSuccessModal && (
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
          <span aria-hidden>✓</span> Tag erased. It&apos;s now blank and ready to be reused.
        </div>
      )}

      {status === "error" && (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <button type="button" onClick={handleReset} className="btn-secondary">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
