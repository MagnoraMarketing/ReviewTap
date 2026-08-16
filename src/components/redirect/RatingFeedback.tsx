"use client";

import { useState } from "react";

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className} aria-hidden>
      <path
        d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A non-blocking rating + "tell us more" step shown above the platform
 * chooser. Submitting a rating (or a message) never gates or delays access
 * to the public review platforms below it - it's purely an extra, optional
 * channel back to the business, never a substitute for a real public review
 * and never used to filter who reaches the public platforms.
 */
export function RatingFeedback({
  publicId,
  accentColor,
  thankYouMessage,
}: {
  publicId: string;
  accentColor?: string;
  thankYouMessage?: string | null;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleRate(value: number) {
    if (rating) return; // Locked in after the first pick - see file header.
    setRating(value);
    setSubmitError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, rating: value }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Couldn't record your rating.");
      setFeedbackId(body.id);
    } catch {
      setSubmitError("Couldn't record your rating, but you can still leave a review below.");
    }
  }

  async function handleSendMessage() {
    if (!feedbackId || !message.trim()) return;
    setMessageStatus("sending");
    try {
      const res = await fetch(`/api/feedback/${feedbackId}/message`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setMessageStatus("sent");
    } catch {
      setMessageStatus("error");
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-ink-900">How was your experience?</p>
      <div className="mt-2 flex justify-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            disabled={rating > 0}
            onClick={() => handleRate(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            style={accentColor ? { color: accentColor } : undefined}
            className="p-0.5 text-amber-400 transition-transform enabled:hover:scale-110 disabled:cursor-default"
          >
            <StarIcon filled={value <= (hoverRating || rating)} className="h-7 w-7" />
          </button>
        ))}
      </div>

      {submitError && <p className="mt-2 text-center text-xs text-red-600">{submitError}</p>}

      {rating > 0 && !submitError && (
        <div className="mt-3">
          <p className="text-center text-xs text-emerald-700">
            {thankYouMessage || "Thanks for your feedback!"}
          </p>
          {messageStatus === "sent" ? (
            <p className="text-center text-xs text-emerald-700">
              Thanks — we&apos;ve passed your message along.
            </p>
          ) : (
            <div className="space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Want to tell us more? (optional)"
                rows={2}
                maxLength={2000}
                className="input"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !feedbackId || messageStatus === "sending"}
                  className="btn-secondary"
                >
                  {messageStatus === "sending" ? "Sending…" : "Send"}
                </button>
                {messageStatus === "error" && (
                  <span className="text-xs text-red-600">Couldn&apos;t send. Try again?</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
