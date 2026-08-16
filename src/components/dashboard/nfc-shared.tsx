"use client";

// Web NFC's scan()/write() promises never resolve or reject on their own if
// no tag is ever presented - without a timeout, a phone that isn't actually
// detecting the chip (NFC off, case blocking the antenna, wrong position on
// the phone) just sits on "Hold your phone against the chip..." forever with
// no feedback at all, which reads as "nothing happens".
export const NFC_TIMEOUT_MS = 20_000;
export const NFC_TIMEOUT_MESSAGE =
  "No chip detected after 20 seconds. Make sure NFC is turned on in your phone's system settings, remove any case or wallet that might block the antenna, and hold the chip against the top-back of your phone without moving it.";

export function nfcErrorMessage(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "AbortError") return "Cancelled.";
  if (name === "NotAllowedError") return "NFC permission was denied. Allow NFC access and try again.";
  if (name === "NotSupportedError") return "This device doesn't support NFC, or NFC is turned off.";
  if (name === "NetworkError") return "No chip detected in time. Hold your phone against it and try again.";
  return "Couldn't complete the NFC action. Please try again.";
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 18.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ResetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17.5 3.5v3.4h-3.4M6.5 20.5v-3.4h3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full-bleed "hold your phone over the tag" state shared by every in-app NFC
 * action (write, verify, reset), styled after the reference NFC-writer apps
 * users are already familiar with (pulsing rings + phone glyph + short
 * instructions).
 */
export function ReadyToScanVisual({
  eyebrow,
  hint,
  onCancel,
}: {
  eyebrow: string;
  hint: string;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-xl2 border border-brand-100 bg-brand-50/60 p-6 text-center">
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-200/60 [animation-duration:1.8s]" />
        <span className="absolute inset-3 animate-ping rounded-full bg-brand-300/60 [animation-duration:1.8s] delay-300" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-card">
          <PhoneIcon className="h-6 w-6 text-brand-600" />
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-600">{eyebrow}</p>
      <p className="mt-1 text-base font-semibold text-ink-900">Ready to Scan</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-gray-500">{hint}</p>
      <button type="button" onClick={onCancel} className="btn-secondary mt-4">
        Cancel
      </button>
    </div>
  );
}

export function SuccessModal({
  title = "Data Written Successfully",
  subtitle = "Your NFC tag is ready to use.",
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl2 bg-white p-6 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <CheckIcon className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        <button type="button" onClick={onDone} className="btn-primary mt-5 w-full">
          Done
        </button>
      </div>
    </div>
  );
}
