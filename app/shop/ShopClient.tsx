"use client";

import { useState } from "react";
import Link from "next/link";
import { DeviceMockup } from "@/components/shop/DeviceMockup";
import { cn } from "@/lib/utils";
import { DEVICE_LIMIT_BY_PLAN } from "@/lib/display";
import type { DeviceVariant, DevicePlan } from "@/types/database";

const PRODUCTS: {
  variant: DeviceVariant;
  name: string;
  description: string;
  bullets: string[];
}[] = [
  {
    variant: "STANDEE_CARD",
    name: "Standee Card",
    description: "A freestanding card for the counter, table or till — impossible to miss.",
    bullets: ["Stands upright on any flat surface", "Ideal for counters & tables", "NFC tap + QR scan"],
  },
  {
    variant: "DESK_TILE",
    name: "Desk Tile",
    description: "A low-profile tile that sits flat — perfect next to a register or reception desk.",
    bullets: ["Slim, flat profile", "Ideal for desks & checkouts", "NFC tap + QR scan"],
  },
];

const PLANS: { plan: DevicePlan; name: string; price: number; description: string; bullets: string[] }[] = [
  {
    plan: "BASIC",
    name: "Basic",
    price: 10,
    description: "One fixed review platform. Simple and to the point.",
    bullets: ["Choose one platform: Google, Facebook, Trustpilot, Tripadvisor or a custom URL", "Change the destination anytime from your dashboard", "Full visit analytics"],
  },
  {
    plan: "PRO",
    name: "Pro",
    price: 20,
    description: "Visitors get to choose their platform — and can share the page.",
    bullets: ["Visitors pick from every platform you enable, at scan time", "Built-in share button on the chooser page", "Everything in Basic, plus multi-platform analytics"],
  },
];

const USPS = [
  {
    title: "Switch platforms in seconds",
    body: "Change destinations anytime — the physical card never needs to be replaced or reprogrammed.",
  },
  {
    title: "The app powers the link",
    body: "The physical card just points to ReviewTap — the app subscription is what lets you set up and change where it goes, and see who's tapping.",
  },
  {
    title: "Real visit analytics",
    body: "See scans over time, by day and by destination — know exactly how often customers are being sent to leave a review.",
  },
  {
    title: "Cancel anytime",
    body: "Manage or cancel your subscription anytime through the secure Stripe billing portal — no phone calls required.",
  },
];

export function ShopClient({
  isLoggedIn,
  existingDeviceCount = 0,
  deviceLimit,
}: {
  isLoggedIn: boolean;
  existingDeviceCount?: number;
  deviceLimit?: number;
}) {
  const [selectedVariant, setSelectedVariant] = useState<DeviceVariant>("STANDEE_CARD");
  const [includeApp, setIncludeApp] = useState(true);
  const [plan, setPlan] = useState<DevicePlan>("BASIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planPrice = PLANS.find((p) => p.plan === plan)!.price;
  const dueToday = 50 + (includeApp ? planPrice : 0);

  async function startCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: selectedVariant, includeApp, plan }),
      });
      const body = await res.json();
      if (!res.ok || !body.url) {
        setError(body.error ?? "Couldn't start checkout.");
        setLoading(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setError("Couldn't start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PRODUCTS.map((product) => {
          const active = selectedVariant === product.variant;
          return (
            <button
              key={product.variant}
              type="button"
              onClick={() => setSelectedVariant(product.variant)}
              className={cn(
                "card flex flex-col items-center text-left transition-all",
                active ? "border-brand-500 ring-2 ring-brand-500" : "hover:border-gray-300",
              )}
            >
              <DeviceMockup variant={product.variant} className="h-44 w-44" />
              <h3 className="mt-4 text-base font-semibold text-ink-900">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-gray-500">
                {product.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-brand-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <span
                className={cn(
                  "mt-4 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold",
                  active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600",
                )}
              >
                {active ? "Selected" : "Select"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card mt-8">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="text-sm text-gray-500">ReviewTap device</p>
            <p className="text-2xl font-semibold text-ink-900">€50 <span className="text-sm font-normal text-gray-400">once</span></p>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={includeApp}
              onChange={(e) => setIncludeApp(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Include the ReviewTap app <span className="badge bg-emerald-50 text-emerald-700">Recommended</span>
          </label>
        </div>

        {includeApp ? (
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            {PLANS.map((p) => {
              const active = plan === p.plan;
              return (
                <button
                  key={p.plan}
                  type="button"
                  onClick={() => setPlan(p.plan)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    active ? "border-brand-500 ring-2 ring-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold text-ink-900">{p.name}</p>
                    <p className="text-lg font-semibold text-ink-900">
                      €{p.price}
                      <span className="text-xs font-normal text-gray-400">/mo</span>
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{p.description}</p>
                  <ul className="mt-3 space-y-1 text-xs text-gray-500">
                    {p.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-1.5">
                        <span className="text-emerald-600">✓</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        ) : null}

        {includeApp && plan === "PRO" && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marketing/reviewtap-pro-solution.png"
              alt="ReviewTap Pro: visitors choose their platform, you manage everything from the dashboard"
              className="w-full"
            />
          </div>
        )}

        {!includeApp && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Without the app, your ReviewTap card won&apos;t redirect anywhere yet. You can add the app
            (and set up your link) anytime from your dashboard.
          </div>
        )}

        {isLoggedIn && deviceLimit !== undefined && existingDeviceCount >= deviceLimit && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            You already have {existingDeviceCount} device{existingDeviceCount === 1 ? "" : "s"}, which
            is the limit for your current plan. You can still buy another — the Pro plan supports up
            to {DEVICE_LIMIT_BY_PLAN.PRO} devices.
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
          {USPS.map((usp) => (
            <div key={usp.title} className="flex gap-3">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{usp.title}</p>
                <p className="text-sm text-gray-500">{usp.body}</p>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6">
          {isLoggedIn ? (
            <button type="button" onClick={startCheckout} disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading
                ? "Starting checkout…"
                : `Continue to checkout — €${dueToday} today${includeApp ? `, then €${planPrice}/mo` : ""}`}
            </button>
          ) : (
            <Link href={`/signup?next=/shop`} className="btn-primary w-full sm:w-auto">
              Create an account to continue
            </Link>
          )}
          <p className="mt-3 text-xs text-gray-400">
            Secure checkout by Stripe. Cancel your subscription anytime — see our{" "}
            <Link href="/terms" className="underline hover:text-gray-600">
              Terms
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
