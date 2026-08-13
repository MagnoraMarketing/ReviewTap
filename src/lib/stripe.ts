import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily-constructed Stripe client. Lazy so that build-time steps (which
 * don't have secrets populated) don't crash importing this module.
 */
export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return stripeClient;
}

export const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

export function isSubscriptionStatusActive(status: string | null | undefined): boolean {
  if (!status) return false;
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

/** Basic = €10/month single-destination plan. Pro = €20/month multi-platform chooser. */
export function getPlanPriceId(plan: "BASIC" | "PRO"): string | undefined {
  return plan === "PRO" ? process.env.STRIPE_PRICE_ID : process.env.STRIPE_PRICE_ID_BASIC;
}
