"use client";

import { CreditCard, Download, ExternalLink, Lock, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";

import { PlansDialog } from "@/components/plans/plans-dialog";
import { StripeReturn } from "@/components/plans/stripe-return";
import { SettingsPage } from "@/components/settings/settings-nav";
import { Button } from "@/components/ui/button";
import { loadBillingDetails, syncBillingPlan, type BillingDetails } from "@/lib/billing";
import { plans, type PlanId } from "@/lib/plans";
import { loadProfile } from "@/lib/profile";

/** D-SET-02 · Subscription */
export default function SubscriptionSettings() {
  const [plansOpen, setPlansOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanId>("free");
  const [billing, setBilling] = useState<BillingDetails | null>(null);
  const [portalError, setPortalError] = useState("");
  const [openingPortal, setOpeningPortal] = useState(false);

  const refreshBilling = () => {
    loadBillingDetails().then((details) => {
      if (details) setBilling(details);
    });
  };

  useEffect(() => {
    syncBillingPlan().then(async (plan) => {
      if (plan) {
        setCurrentPlan(plan);
        return;
      }
      const result = await loadProfile();
      const value = result?.profile.plan;
      if (value === "individual" || value === "premium") setCurrentPlan(value);
    });
    refreshBilling();
  }, []);

  const openPortal = async () => {
    setPortalError("");
    setOpeningPortal(true);
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const body = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
    if (!response.ok || !body?.url) {
      setOpeningPortal(false);
      setPortalError(body?.error || "Couldn't open billing.");
      return;
    }
    window.location.assign(body.url);
  };

  const selected = plans.find((item) => item.id === currentPlan) ?? plans[0];

  return (
    <SettingsPage title="Subscription" width={640}>
      <StripeReturn />
      <section className="rounded-[20px] border border-line bg-white px-6 py-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-text-primary">{selected.name}</span>
            <span className="rounded-full bg-success-tint px-2 py-0.5 font-display text-xs font-semibold text-success">Active</span>
          </p>
          <p className="font-display">
            <span className="text-lg font-bold text-text-primary">{selected.price}</span>
            {selected.period ? <span className="text-sm text-text-secondary">{selected.period}</span> : null}
          </p>
        </div>
        {currentPlan !== "free" && (
        <dl className="mt-4 flex flex-col gap-3 border-y border-line py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Next payment</dt>
            <dd className="text-text-primary">{billing ? (billing.nextPayment ?? "—") : "…"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Payment method</dt>
            <dd className="flex items-center gap-1.5 text-text-primary">
              <CreditCard className="size-4 text-text-secondary" aria-hidden />
              {billing?.card ?? "…"}
            </dd>
          </div>
        </dl>
        )}
        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" className="h-10 rounded-[10px] px-4 font-normal" onClick={() => setPlansOpen(true)}>
            Change plan
          </Button>
          {currentPlan !== "free" && (
            <button
              type="button"
              onClick={openPortal}
              disabled={openingPortal}
              className="flex items-center gap-1.5 rounded-sm text-sm text-text-secondary outline-none hover:text-text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {openingPortal ? "Opening…" : "Manage or cancel"}
              <ExternalLink className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
        {portalError ? (
          <p role="alert" className="pt-3 text-sm text-error">
            {portalError}
          </p>
        ) : null}
      </section>

      {currentPlan !== "free" && (
      <section aria-labelledby="invoices" className="flex flex-col gap-3 pt-4">
        <h2 id="invoices" className="font-display text-lg font-semibold text-text-primary">
          Invoices
        </h2>
        {!billing ? (
          <p className="text-sm text-text-secondary">Loading invoices</p>
        ) : billing.invoices.length === 0 ? (
          <p className="text-sm text-text-secondary">No invoices yet.</p>
        ) : (
          <ul className="divide-y divide-line rounded-[16px] border border-line bg-white">
            {billing.invoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
                <ReceiptText className="size-4 text-text-secondary" aria-hidden />
                <span className="flex-1 text-text-primary">{invoice.date}</span>
                <span className="text-text-primary">{invoice.amount}</span>
                <span
                  className={
                    invoice.status === "Paid"
                      ? "rounded-full bg-success-tint px-2 py-0.5 font-display text-xs font-semibold text-success"
                      : "rounded-full bg-surface-page px-2 py-0.5 font-display text-xs font-semibold text-text-secondary"
                  }
                >
                  {invoice.status}
                </span>
                {invoice.pdf ? (
                  <a
                    href={invoice.pdf}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Download invoice ${invoice.date}`}
                    className="flex items-center gap-1 rounded-sm text-text-secondary hover:text-text-primary hover:underline"
                  >
                    <Download className="size-3.5" aria-hidden />
                    Download
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
        <Lock className="size-3" aria-hidden />
        Payments are processed securely by Stripe.
      </p>

      <PlansDialog
        open={plansOpen}
        onOpenChange={setPlansOpen}
        onNotNow={() => {}}
        title="Change your plan"
        description="You can switch or cancel any time."
        currentPlan={currentPlan}
        onPlanSaved={(plan) => {
          setCurrentPlan(plan);
          refreshBilling();
        }}
      />
    </SettingsPage>
  );
}
