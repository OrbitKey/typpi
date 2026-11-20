import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { currentSubscription, findCustomer, getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

function longDate(unix: number) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(unix * 1000);
}

function shortDate(unix: number) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(unix * 1000);
}

function money(amount: number | null, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format((amount ?? 0) / 100);
}

function cardLabel(method: Stripe.PaymentMethod | string | null) {
  if (!method || typeof method === "string" || method.type !== "card" || !method.card) return null;
  const brand = method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1);
  return `${brand} •••• ${method.card.last4}`;
}

function invoiceStatus(status: Stripe.Invoice.Status | null) {
  if (status === "paid") return "Paid";
  if (status === "open") return "Open";
  if (status === "void") return "Void";
  return "Unpaid";
}

/** Next charge, saved card, and invoices for the signed-in Stripe customer. */
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
    if (!customer) return NextResponse.json({ nextPayment: null, card: null, invoices: [] });

    const subscription = await currentSubscription(stripe, customer.id);
    let nextPayment: string | null = null;
    let card: string | null = null;
    if (subscription && !subscription.cancel_at_period_end) {
      const full = await stripe.subscriptions.retrieve(subscription.id, { expand: ["default_payment_method"] });
      const periodEnd = full.items.data[0]?.current_period_end;
      if (periodEnd) nextPayment = longDate(periodEnd);
      card = cardLabel(full.default_payment_method);
    }

    const listed = await stripe.invoices.list({ customer: customer.id, limit: 12 });
    const invoices = listed.data
      .filter((invoice) => invoice.status !== "draft")
      .map((invoice) => ({
        id: invoice.id,
        date: shortDate(invoice.created),
        amount: money(invoice.status === "paid" ? invoice.amount_paid : invoice.amount_due, invoice.currency),
        status: invoiceStatus(invoice.status),
        pdf: invoice.invoice_pdf ?? null,
      }));

    return NextResponse.json({ nextPayment, card, invoices });
  } catch {
    return NextResponse.json({ error: "Couldn't load billing." }, { status: 500 });
  }
}
