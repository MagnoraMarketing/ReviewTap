import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStripe, getPlanPriceId } from "@/lib/stripe";
import { DEVICE_PLANS } from "@/lib/validation";

const requestSchema = z.object({ plan: z.enum(DEVICE_PLANS) });

/**
 * Lets a customer who already bought the physical device (hardware-only
 * checkout) add the ReviewTap app subscription afterwards, so they can set
 * up their destination link and see statistics.
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
    return NextResponse.json({ error: "Please choose a plan." }, { status: 400 });
  }

  const priceId = getPlanPriceId(parsed.data.plan);
  if (!priceId) {
    return NextResponse.json({ error: "Billing is not configured." }, { status: 500 });
  }

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: existingSubscription?.stripe_customer_id,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { metadata: { user_id: user.id, plan: parsed.data.plan } },
      metadata: { user_id: user.id, device_plan: parsed.data.plan },
      allow_promotion_codes: true,
      success_url: `${appUrl}/dashboard/billing?added=1`,
      cancel_url: `${appUrl}/dashboard/billing`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout.session.create (add-app) failed", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
