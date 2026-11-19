import type { PlanId } from "@/lib/plans";

export type BillingInvoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Open" | "Void" | "Unpaid";
  pdf: string | null;
};

export type BillingDetails = {
  nextPayment: string | null;
  card: string | null;
  invoices: BillingInvoice[];
};

/** Next payment date, card, and invoices from Stripe. */
export async function loadBillingDetails(): Promise<BillingDetails | null> {
  const response = await fetch("/api/stripe/billing", { method: "POST" });
  if (!response.ok) return null;
  const body = (await response.json().catch(() => null)) as BillingDetails | null;
  if (!body || !Array.isArray(body.invoices)) return null;
  return body;
}

/** Reads the Stripe subscription and returns the plan stored on the profile. */
export async function syncBillingPlan(): Promise<PlanId | null> {
  const response = await fetch("/api/stripe/sync", { method: "POST" });
  if (!response.ok) return null;
  const body = (await response.json().catch(() => null)) as { plan?: PlanId } | null;
  if (body?.plan === "individual" || body?.plan === "premium" || body?.plan === "free") return body.plan;
  return null;
}
