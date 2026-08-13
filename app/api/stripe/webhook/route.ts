import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateDevicePublicId } from "@/lib/utils";
import { DEVICE_VARIANTS, DEVICE_PLANS } from "@/lib/validation";
import type { SubscriptionStatus, DeviceVariant, DevicePlan } from "@/types/database";

// Webhooks need the raw body for signature verification, and must not be
// affected by static optimization.
export const dynamic = "force-dynamic";

function readPlan(raw: string | undefined): DevicePlan {
  return (DEVICE_PLANS as readonly string[]).includes(raw ?? "") ? (raw as DevicePlan) : "BASIC";
}

async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  fallbackUserId?: string,
) {
  const supabaseAdmin = createAdminClient();
  const userId = subscription.metadata?.user_id || fallbackUserId;

  if (!userId) {
    console.error("Stripe subscription webhook missing user_id metadata", subscription.id);
    return;
  }

  const plan = readPlan(subscription.metadata?.plan);
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      status: subscription.status as SubscriptionStatus,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (error) {
    console.error("Failed to upsert subscription", error);
    return;
  }

  // The subscription's plan governs behaviour for every device on this
  // account (the MVP's "one plan per account" model) - keep devices in
  // sync whenever the plan is known from Stripe metadata.
  if (subscription.metadata?.plan) {
    const { error: deviceError } = await supabaseAdmin
      .from("devices")
      .update({ plan })
      .eq("user_id", userId);
    if (deviceError) {
      console.error("Failed to sync device plan", deviceError);
    }
  }
}

async function createDeviceForCheckoutSession(session: Stripe.Checkout.Session) {
  const supabaseAdmin = createAdminClient();
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error("checkout.session.completed missing user_id metadata", session.id);
    return;
  }

  // Sessions that only add/change the app subscription (no device purchase)
  // don't carry a device_variant - nothing to provision here.
  if (!session.metadata?.device_variant) return;

  const { data: existingDevice } = await supabaseAdmin
    .from("devices")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();

  if (existingDevice) return; // Already provisioned for this checkout - webhook retry.

  const rawVariant = session.metadata?.device_variant;
  const variant: DeviceVariant = (DEVICE_VARIANTS as readonly string[]).includes(rawVariant ?? "")
    ? (rawVariant as DeviceVariant)
    : "STANDEE_CARD";
  const plan = readPlan(session.metadata?.device_plan);

  for (let attempt = 0; attempt < 5; attempt++) {
    const publicId = generateDevicePublicId();
    const { error } = await supabaseAdmin.from("devices").insert({
      user_id: userId,
      public_id: publicId,
      name: "My ReviewTap",
      variant,
      plan,
      status: "ACTIVE",
      destination_type: "GOOGLE_REVIEWS",
      destination_url: null,
      destinations: [],
      stripe_checkout_session_id: session.id,
    });

    if (!error) return;
    // Unique violation on public_id (extremely unlikely) - retry with a new one.
    if (error.code !== "23505") {
      console.error("Failed to create device from checkout session", error);
      return;
    }
  }

  console.error("Exhausted retries generating a unique device public_id", session.id);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await upsertSubscriptionFromStripe(subscription, session.metadata?.user_id);
        }
        await createDeviceForCheckoutSession(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(subscription);
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscriptionId =
            typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await upsertSubscriptionFromStripe(subscription);
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error(`Error handling Stripe webhook event ${event.type}`, error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
