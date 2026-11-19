import { NextResponse } from "next/server";

import type { PlanId } from "@/lib/plans";
import {
  currentSubscription,
  findOrCreateCustomer,
  getStripe,
  planOfSubscription,
  priceFor,
  requestOrigin,
  safeReturnTo,
} from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

async function savePlan(userId: string, plan: PlanId) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ plan }).eq("id", userId);
  return !error;
}

/** Starts a test-mode Stripe Checkout for Individual or Premium, or cancels when the choice is Free. */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe isn't configured." }, { status: 500 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { plan?: PlanId; returnTo?: string } | null;
  const plan = body?.plan;
  if (plan !== "free" && plan !== "individual" && plan !== "premium") {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  try {
    const customer = await findOrCreateCustomer(stripe, user.id, user.email ?? null);
    const subscription = await currentSubscription(stripe, customer.id);

    if (plan === "free") {
      if (subscription) await stripe.subscriptions.cancel(subscription.id);
      if (!(await savePlan(user.id, "free"))) {
        return NextResponse.json({ error: "Couldn't save that plan." }, { status: 500 });
      }
      return NextResponse.json({ plan: "free" satisfies PlanId });
    }

    const price = await priceFor(stripe, plan);
    if (subscription) {
      const current = await planOfSubscription(stripe, subscription);
      if (current !== plan) {
        const item = subscription.items.data[0];
        const updated = await stripe.subscriptions.update(subscription.id, {
          items: [{ id: item.id, price: price.id }],
          proration_behavior: "create_prorations",
          metadata: { user_id: user.id, plan },
        });
        if (updated.status !== "active" && updated.status !== "trialing" && updated.status !== "past_due") {
          return NextResponse.json({ error: "Couldn't switch that plan." }, { status: 402 });
        }
      }
      if (!(await savePlan(user.id, plan))) {
        return NextResponse.json({ error: "Couldn't save that plan." }, { status: 500 });
      }
      return NextResponse.json({ plan });
    }

    const origin = requestOrigin(request);
    const returnTo = safeReturnTo(body?.returnTo);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      client_reference_id: user.id,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${origin}${returnTo}${returnTo.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnTo}`,
      metadata: { user_id: user.id, plan },
      subscription_data: { metadata: { user_id: user.id, plan } },
      // This account turns on Managed Payments by default, which rejects a session without a product tax code.
      managed_payments: { enabled: false },
    });
    if (!session.url) return NextResponse.json({ error: "Couldn't open the payment page." }, { status: 500 });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Couldn't open the payment page." }, { status: 500 });
  }
}
