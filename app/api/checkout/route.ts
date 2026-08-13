import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getPlanPriceId } from "@/lib/stripe";
import { DEVICE_VARIANTS, DEVICE_PLANS } from "@/lib/validation";
import { z } from "zod";
import type Stripe from "stripe";

const requestSchema = z.object({
  variant: z.enum(DEVICE_VARIANTS),
  // The app subscription is a recommended add-on, not mandatory - the
  // physical device can be bought on its own and the app added later from
  // Dashboard → Billing.
  includeApp: z.boolean().default(true),
  plan: z.enum(DEVICE_PLANS).default("BASIC"),
});

/**
 * Starts a Stripe Checkout session for the one-time €50 NFC/QR device fee,
 * optionally bundled with the ReviewTap app subscription (Basic €10/mo or
 * Pro €20/mo). When bundled, Checkout runs in "subscription" mode with the
 * one-time price added as an extra line item (a mixed cart); when the
 * device is bought alone it runs in plain "payment" mode.
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid device selection." }, { status: 400 });
  }
  const { variant, includeApp, plan } = parsed.data;

  const oneTimePriceId = process.env.STRIPE_PRICE_ID_ONE_TIME;
  const planPriceId = includeApp ? getPlanPriceId(plan) : undefined;

  if (!oneTimePriceId || (includeApp && !planPriceId)) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const stripe = getStripe();

  // Reuse an existing Stripe customer for this user if we already have one.
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const metadata = {
    user_id: user.id,
    device_variant: variant,
    device_plan: plan,
  };

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = includeApp
    ? [
        { price: oneTimePriceId, quantity: 1 },
        { price: planPriceId!, quantity: 1 },
      ]
    : [{ price: oneTimePriceId, quantity: 1 }];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: includeApp ? "subscription" : "payment",
      customer: existingSubscription?.stripe_customer_id,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : user.email,
      line_items: lineItems,
      ...(includeApp
        ? { subscription_data: { metadata: { user_id: user.id, plan } } }
        : {}),
      metadata,
      allow_promotion_codes: true,
      success_url: `${appUrl}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/shop`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout.session.create failed", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
