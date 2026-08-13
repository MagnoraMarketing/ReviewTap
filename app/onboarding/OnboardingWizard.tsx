"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MultiDestinationForm } from "@/components/dashboard/MultiDestinationForm";
import { DESTINATION_LABELS, DESTINATION_PLACEHOLDERS } from "@/lib/display";
import { DESTINATION_TYPES } from "@/lib/validation";
import type { DestinationType, Device } from "@/types/database";

const OPTIONS = DESTINATION_TYPES;

type Step = "waiting" | "destination" | "destination-pro" | "ready";

export function OnboardingWizard() {
  const [device, setDevice] = useState<Device | null>(null);
  const [step, setStep] = useState<Step>("waiting");
  const [attempts, setAttempts] = useState(0);
  const [type, setType] = useState<DestinationType>("GOOGLE_REVIEWS");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (device) return;
    pollRef.current = setInterval(async () => {
      const res = await fetch("/api/devices/latest", { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        if (body.device) {
          setDevice(body.device);
          setStep(body.device.plan === "PRO" ? "destination-pro" : "destination");
          if (pollRef.current) clearInterval(pollRef.current);
          return;
        }
      }
      setAttempts((a) => a + 1);
    }, 1500);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [device]);

  useEffect(() => {
    if (step !== "ready" || !device) return;
    fetch(`/api/devices/${device.id}/qr?format=png`)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setQrDataUrl(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => setQrDataUrl(null));
  }, [step, device]);

  if (step === "waiting") {
    return (
      <div className="card flex flex-col items-center gap-3 py-16 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <h1 className="text-lg font-semibold text-ink-900">Finishing your setup…</h1>
        <p className="max-w-sm text-sm text-gray-500">
          We&apos;re confirming your payment and generating your ReviewTap device. This usually takes
          a few seconds.
        </p>
        {attempts > 8 && (
          <p className="text-xs text-gray-400">
            Taking longer than expected? Refresh this page, or check{" "}
            <Link href="/dashboard/devices" className="text-brand-600 hover:text-brand-700">
              your devices
            </Link>
            .
          </p>
        )}
      </div>
    );
  }

  if (step === "destination" && device) {
    return (
      <div className="card">
        <h1 className="text-lg font-semibold text-ink-900">Choose your review platform</h1>
        <p className="mt-1 text-sm text-gray-500">
          Where should customers land when they tap or scan your ReviewTap?
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSaving(true);
            const res = await fetch(`/api/devices/${device.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ destination_type: type, destination_url: url }),
            });
            setSaving(false);
            if (!res.ok) {
              const body = await res.json().catch(() => ({}));
              setError(body.error ?? "Couldn't save your destination.");
              return;
            }
            setDevice({ ...device, destination_type: type, destination_url: url });
            setStep("ready");
          }}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {OPTIONS.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
                  type === option ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="destination_type"
                  checked={type === option}
                  onChange={() => setType(option)}
                  className="h-4 w-4 accent-brand-600"
                />
                <span className="font-medium text-ink-900">{DESTINATION_LABELS[option]}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="label" htmlFor="url">
              {DESTINATION_LABELS[type]} URL
            </label>
            <input
              id="url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={DESTINATION_PLACEHOLDERS[type]}
              className="input"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  if (step === "destination-pro" && device) {
    return (
      <div className="card">
        <h1 className="text-lg font-semibold text-ink-900">Choose your review platforms</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your Pro plan lets visitors pick from several platforms when they tap or scan. Enable at
          least one.
        </p>
        <div className="mt-6">
          <MultiDestinationForm
            deviceId={device.id}
            initialDestinations={device.destinations}
            onSaved={(destinations) => {
              setDevice({ ...device, destinations });
              setStep("ready");
            }}
          />
        </div>
      </div>
    );
  }

  if (step === "ready" && device) {
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/r/${device.public_id}`;
    return (
      <div className="card text-center">
        <h1 className="text-lg font-semibold text-ink-900">Your ReviewTap is ready 🎉</h1>
        <p className="mt-1 text-sm text-gray-500">
          {device.plan === "PRO"
            ? "Visitors will choose their platform when they tap or scan."
            : `Sending customers to ${DESTINATION_LABELS[device.destination_type]}.`}
        </p>

        {qrDataUrl && (
          <div className="mx-auto mt-6 w-fit rounded-xl border border-gray-100 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="ReviewTap QR code" width={180} height={180} />
          </div>
        )}

        <div className="mx-auto mt-4 max-w-sm rounded-lg bg-gray-100 px-3 py-2 text-sm text-ink-900">
          {redirectUrl}
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Device ID {device.public_id} — write this URL to your NFC chip from Dashboard → NFC setup.
        </p>

        <Link href="/dashboard" className="btn-primary mt-6 w-full">
          Open Dashboard
        </Link>
      </div>
    );
  }

  return null;
}
