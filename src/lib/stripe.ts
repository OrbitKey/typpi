import Stripe from "stripe";

import type { PlanId } from "@/lib/plans";

export type PaidPlan = Exclude<PlanId, "free">;

const prices: Record<PaidPlan, { amount: number; name: string; lookupKey: string }> = {
  individual: { amount: 799, name: "Typpi Individual", lookupKey: "typpi_individual_monthly" },
  premium: { amount: 1199, name: "Typpi Premium", lookupKey: "typpi_premium_monthly" },
};

let stripeClient: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export function requestOrigin(request: Request) {
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwarded || request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";
  if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) return "http://localhost:3000";
  if (proto !== "http" && proto !== "https") return "http://localhost:3000";
  return `${proto}://${host}`;
}

export function safeReturnTo(value: unknown) {
  if (typeof value !== "string" || value.length > 200) return "/settings/subscription";
  if (!value.startsWith("/") || value.startsWith("//")) return "/settings/subscription";
  const path = value.split("?")[0];
  if (path !== "/settings/subscription" && path !== "/pathway" && path !== "/lesson/complete") {
    return "/settings/subscription";
  }
  return value;
}

export async function priceFor(stripe: Stripe, plan: PaidPlan) {
  const spec = prices[plan];
  const existing = await stripe.prices.list({ lookup_keys: [spec.lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0];
  return stripe.prices.create({
    currency: "usd",
    unit_amount: spec.amount,
    recurring: { interval: "month" },
    lookup_key: spec.lookupKey,
    transfer_lookup_key: true,
    product_data: { name: spec.name },
  });
}

export function planFromPrice(price: Stripe.Price): PaidPlan | null {
  if (price.lookup_key === prices.individual.lookupKey) return "individual";
  if (price.lookup_key === prices.premium.lookupKey) return "premium";
  return null;
}

export async function findCustomer(stripe: Stripe, userId: string, email: string | null) {
  if (email) {
    const listed = await stripe.customers.list({ email, limit: 10 });
    const match = listed.data.find((customer) => customer.metadata.user_id === userId);
    if (match) return match;
  }
  try {
    const searched = await stripe.customers.search({
      query: `metadata['user_id']:'${userId}'`,
      limit: 1,
    });
    return searched.data[0] ?? null;
  } catch {
    return null;
  }
}

export async function findOrCreateCustomer(stripe: Stripe, userId: string, email: string | null) {
  const existing = await findCustomer(stripe, userId, email);
  if (existing) return existing;
  return stripe.customers.create({
    email: email ?? undefined,
    metadata: { user_id: userId },
  });
}

export async function currentSubscription(stripe: Stripe, customerId: string) {
  const listed = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
    expand: ["data.items.data.price"],
  });
  return (
    listed.data.find((subscription) => subscription.status === "active" || subscription.status === "past_due" || subscription.status === "trialing") ??
    null
  );
}

export async function planOfSubscription(stripe: Stripe, subscription: Stripe.Subscription) {
  const price = subscription.items.data[0]?.price;
  if (!price) return null;
  const full = typeof price === "string" ? await stripe.prices.retrieve(price) : price;
  return planFromPrice(full);
}
