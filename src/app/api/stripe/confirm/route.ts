import { NextResponse } from "next/server";

import type { PlanId } from "@/lib/plans";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

/** Saves the plan after Stripe redirects back from a completed Checkout session. */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe isn't configured." }, { status: 500 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { sessionId?: string } | null;
  const sessionId = body?.sessionId;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing payment session." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.metadata?.user_id !== user.id || session.status !== "complete") {
      return NextResponse.json({ error: "Couldn't confirm the payment." }, { status: 403 });
    }
    const plan = session.metadata.plan;
    if (plan !== "individual" && plan !== "premium") {
      return NextResponse.json({ error: "Couldn't confirm the payment." }, { status: 400 });
    }
    const { error } = await supabase.from("profiles").update({ plan }).eq("id", user.id);
    if (error) return NextResponse.json({ error: "Couldn't save that plan." }, { status: 500 });
    return NextResponse.json({ plan: plan satisfies PlanId });
  } catch {
    return NextResponse.json({ error: "Couldn't confirm the payment." }, { status: 500 });
  }
}
