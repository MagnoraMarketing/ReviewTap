"use client";

import { useEffect, useRef, useState } from "react";

type WriteStatus = "idle" | "writing" | "written" | "error";
type VerifyMethod = "nfc" | "qr" | null;
type VerifyStatus = "idle" | "scanning" | "verified" | "mismatch" | "error";

// Web NFC's scan()/write() promises never resolve or reject on their own if
// no tag is ever presented - without a timeout, a phone that isn't actually
// detecting the chip (NFC off, case blocking the antenna, wrong position on
// the phone) just sits on "Hold your phone against the chip..." forever with
// no feedback at all, which reads as "nothing happens".
const NFC_TIMEOUT_MS = 20_000;
const NFC_TIMEOUT_MESSAGE =
  "No chip detected after 20 seconds. Make sure NFC is turned on in your phone's system settings, remove any case or wallet that might block the antenna, and hold the chip against the top-back of your phone without moving it.";

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, "").toLowerCase();
}

function decodeUrlRecord(message: NDEFMessage): string | null {
  const record = message.records.find((r) => r.recordType === "url" || r.recordType === "absolute-url");
  if (!record?.data) return null;
  try {
    return new TextDecoder().decode(record.data);
  } catch {
    return null;
  }
}

function nfcErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "AbortError") return "Cancelled.";
  if (name === "NotAllowedError") return "NFC permission was denied. Allow NFC access and try again.";
  if (name === "NotSupportedError") return "This device doesn't support NFC, or NFC is turned off.";
  if (name === "NetworkError") return "No chip detected in time. Hold your phone against it and try again.";
  return "Couldn't complete the NFC action. Please try again.";
}

/**
 * In-app NFC programming + verification. Web NFC (NDEFReader) is Chrome-on-
 * Android only, so this always coexists with the manual instructions used by
 * every other browser (see /dashboard/nfc) rather than replacing them.
 */
export function NfcDeviceWriter({ url }: { url: string }) {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [qrSupported, setQrSupported] = useState(false);
  const [writeStatus, setWriteStatus] = useState<WriteStatus>("idle");
  const [writeError, setWriteError] = useState<string | null>(null);

  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const writeAbortRef = useRef<AbortController | null>(null);
  const writeTimedOutRef = useRef(false);
  const nfcVerifyAbortRef = useRef<AbortController | null>(null);
  const verifyTimedOutRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const qrIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setNfcSupported(typeof window !== "undefined" && "NDEFReader" in window);
    setQrSupported(
      typeof window !== "undefined" &&
        "BarcodeDetector" in window &&
        Boolean(navigator.mediaDevices?.getUserMedia),
    );
    return () => {
      writeAbortRef.current?.abort();
      nfcVerifyAbortRef.current?.abort();
      stopQrScan();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, []);

  function stopQrScan() {
    if (qrIntervalRef.current !== null) {
      window.clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function handleWrite() {
    setWriteError(null);
    setWriteStatus("writing");
    writeTimedOutRef.current = false;
    const controller = new AbortController();
    writeAbortRef.current = controller;
    const timeoutId = window.setTimeout(() => {
      writeTimedOutRef.current = true;
      controller.abort();
    }, NFC_TIMEOUT_MS);
    try {
      const ndef = new NDEFReader();
      await ndef.write({ records: [{ recordType: "url", data: url }] }, { signal: controller.signal });
      setWriteStatus("written");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        if (writeTimedOutRef.current) {
          setWriteStatus("error");
          setWriteError(NFC_TIMEOUT_MESSAGE);
        } else {
          setWriteStatus("idle");
        }
        return;
      }
      setWriteStatus("error");
      setWriteError(nfcErrorMessage(error));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function cancelWrite() {
    writeAbortRef.current?.abort();
  }

  async function handleVerifyNfc() {
    setVerifyMethod("nfc");
    setVerifyError(null);
    setVerifyStatus("scanning");
    verifyTimedOutRef.current = false;
    const controller = new AbortController();
    nfcVerifyAbortRef.current = controller;
    const timeoutId = window.setTimeout(() => {
      verifyTimedOutRef.current = true;
      controller.abort();
    }, NFC_TIMEOUT_MS);
    try {
      const ndef = new NDEFReader();
      ndef.onreading = (event) => {
        window.clearTimeout(timeoutId);
        const decoded = decodeUrlRecord(event.message);
        if (decoded && normalizeUrl(decoded) === normalizeUrl(url)) {
          setVerifyStatus("verified");
        } else {
          setVerifyStatus("mismatch");
        }
        controller.abort();
      };
      await ndef.scan({ signal: controller.signal });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        if (verifyTimedOutRef.current) {
          setVerifyStatus("error");
          setVerifyError(NFC_TIMEOUT_MESSAGE);
        }
        return;
      }
      setVerifyStatus("error");
      setVerifyError(nfcErrorMessage(error));
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function handleVerifyQr() {
    setVerifyMethod("qr");
    setVerifyError(null);
    setVerifyStatus("scanning");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      qrIntervalRef.current = window.setInterval(async () => {
        if (!videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length === 0) return;
          const match = codes.some((code) => normalizeUrl(code.rawValue) === normalizeUrl(url));
          stopQrScan();
          setVerifyStatus(match ? "verified" : "mismatch");
        } catch {
          // Transient decode failure - keep scanning.
        }
      }, 400);
    } catch {
      setVerifyStatus("error");
      setVerifyError("Camera access was blocked or unavailable. Check your browser permissions.");
    }
  }

  function cancelVerify() {
    nfcVerifyAbortRef.current?.abort();
    stopQrScan();
    setVerifyStatus("idle");
    setVerifyMethod(null);
  }

  function resetVerify() {
    setVerifyStatus("idle");
    setVerifyMethod(null);
    setVerifyError(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-ink-900">1. Write the chip from your phone</h3>
        {nfcSupported ? (
          <div className="mt-2">
            {writeStatus === "idle" && (
              <button type="button" onClick={handleWrite} className="btn-primary">
                Scan &amp; write with your phone
              </button>
            )}
            {writeStatus === "writing" && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hold your phone against the chip…</span>
                <button type="button" onClick={cancelWrite} className="btn-secondary">
                  Cancel
                </button>
              </div>
            )}
            {writeStatus === "written" && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                <span aria-hidden>✓</span> Chip programmed with your ReviewTap URL.
              </div>
            )}
            {writeStatus === "error" && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">{writeError}</p>
                <button type="button" onClick={handleWrite} className="btn-secondary">
                  Try again
                </button>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Requires Chrome on Android with NFC turned on. Hold the back of your phone against the
              chip when prompted.
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-amber-700">
            Your browser doesn&apos;t support writing NFC chips from a webpage (this needs Chrome on
            Android). Use the manual instructions below instead.
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-900">2. Verify it points to the right link</h3>
        <p className="mt-1 text-xs text-gray-400">
          Scan the chip again, or scan the QR code, to confirm it sends visitors to the right place
          before you set your review destination below.
        </p>

        <div className="mt-2">
          {verifyStatus === "idle" && (
            <div className="flex flex-wrap gap-2">
              {nfcSupported && (
                <button type="button" onClick={handleVerifyNfc} className="btn-secondary">
                  Verify with NFC
                </button>
              )}
              {qrSupported && (
                <button type="button" onClick={handleVerifyQr} className="btn-secondary">
                  Verify with QR camera
                </button>
              )}
              {!nfcSupported && !qrSupported && (
                <p className="text-sm text-gray-500">
                  Your browser doesn&apos;t support in-app verification. Test the chip or QR code with
                  your phone&apos;s camera app instead.
                </p>
              )}
            </div>
          )}

          {verifyStatus === "scanning" && verifyMethod === "nfc" && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hold your phone against the chip…</span>
              <button type="button" onClick={cancelVerify} className="btn-secondary">
                Cancel
              </button>
            </div>
          )}

          {verifyStatus === "scanning" && verifyMethod === "qr" && (
            <div className="space-y-2">
              <video
                ref={videoRef}
                muted
                playsInline
                className="aspect-square w-full max-w-[240px] rounded-xl border border-gray-200 bg-black object-cover"
              />
              <div>
                <button type="button" onClick={cancelVerify} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {verifyStatus === "verified" && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <span aria-hidden>✓</span> Verified — this device points to your ReviewTap link.
            </div>
          )}

          {verifyStatus === "mismatch" && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">
                That scan doesn&apos;t match this device&apos;s URL. Make sure you&apos;re scanning
                the right chip or QR code.
              </p>
              <button type="button" onClick={resetVerify} className="btn-secondary">
                Try again
              </button>
            </div>
          )}

          {verifyStatus === "error" && (
            <div className="space-y-2">
              <p className="text-sm text-red-600">{verifyError}</p>
              <button type="button" onClick={resetVerify} className="btn-secondary">
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
