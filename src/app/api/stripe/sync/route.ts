import { NextResponse } from "next/server";

import type { PlanId } from "@/lib/plans";
import { currentSubscription, findCustomer, getStripe, planOfSubscription } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

/** Matches the saved plan to the Stripe subscription, if this user already has one. */
export async function POST() {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe isn't configured." }, { status: 500 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    const customer = await findCustomer(stripe, user.id, user.email ?? null);
    if (!customer) {
      const { data } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
      const plan: PlanId = data?.plan === "individual" || data?.plan === "premium" ? data.plan : "free";
      return NextResponse.json({ plan });
    }

    const subscription = await currentSubscription(stripe, customer.id);
    const paid = subscription ? await planOfSubscription(stripe, subscription) : null;
    const plan: PlanId = paid ?? "free";
    const { error } = await supabase.from("profiles").update({ plan }).eq("id", user.id);
    if (error) return NextResponse.json({ error: "Couldn't save that plan." }, { status: 500 });
    return NextResponse.json({ plan });
  } catch {
    return NextResponse.json({ error: "Couldn't check the subscription." }, { status: 500 });
  }
}
