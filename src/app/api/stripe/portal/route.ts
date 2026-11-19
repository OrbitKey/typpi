import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { findCustomer, getStripe, requestOrigin } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

async function portalConfiguration(stripe: Stripe) {
  const existing = await stripe.billingPortal.configurations.list({ limit: 1 });
  if (existing.data[0]) return existing.data[0].id;
  const created = await stripe.billingPortal.configurations.create({
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true, mode: "at_period_end", proration_behavior: "none" },
    },
  });
  return created.id;
}

/** Opens the Stripe customer portal so a paid member can update the card or cancel. */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe isn't configured." }, { status: 500 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    const customer = await findCustomer(stripe, user.id, user.email ?? null);
    if (!customer) return NextResponse.json({ error: "Choose a paid plan first." }, { status: 400 });
    const configuration = await portalConfiguration(stripe);
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      configuration,
      return_url: `${requestOrigin(request)}/settings/subscription`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Couldn't open billing." }, { status: 500 });
  }
}
