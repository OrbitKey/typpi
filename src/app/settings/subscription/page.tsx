"use client";

import { Calendar, CreditCard, Download, ExternalLink, Lock, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { PlansDialog } from "@/components/plans/plans-dialog";
import { StripeReturn } from "@/components/plans/stripe-return";
import { SettingsPage } from "@/components/settings/settings-nav";
import { Button } from "@/components/ui/button";
import { loadBillingDetails, syncBillingPlan, type BillingDetails, type BillingInvoice } from "@/lib/billing";
import { plans, type PlanId } from "@/lib/plans";
import { loadProfile } from "@/lib/profile";

/** D-SET-02 · Subscription */
export default function SubscriptionSettings() {
  const { t } = useLocale();
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
    <SettingsPage title={t("subscription")} width={640} back>
      <StripeReturn />
      <section className="rounded-[20px] border border-line bg-white px-4 py-5 shadow-xs md:px-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2">
              <span className="font-display text-lg font-semibold text-text-primary">{selected.name}</span>
              {currentPlan !== "free" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success-tint px-2 py-0.5 font-display text-xs font-semibold text-success">
                  <span aria-hidden className="size-1.5 rounded-full bg-success md:hidden" />
                  Active
                </span>
              )}
            </p>
            {selected.period ? <p className="pt-1 text-sm text-text-secondary md:hidden">Billed monthly</p> : null}
          </div>
          <p className="text-right font-display">
            <span className="text-lg font-bold text-text-primary">{selected.price}</span>
            {selected.period ? <span className="block text-sm text-text-secondary md:inline">{selected.period}</span> : null}
          </p>
        </div>
        {currentPlan !== "free" && (
        <dl className="mt-4 flex flex-col gap-3 border-y border-line py-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-text-secondary">
              <Calendar className="size-4 md:hidden" aria-hidden />
              Next payment
            </dt>
            <dd className="text-text-primary">{billing ? (billing.nextPayment ?? "—") : "…"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-text-secondary">
              <CreditCard className="size-4" aria-hidden />
              Payment method
            </dt>
            <dd className="rounded-full bg-surface-tint px-2 py-0.5 font-display text-xs font-semibold text-text-primary md:bg-transparent md:p-0 md:text-sm md:font-normal">
              {billing?.card ?? "…"}
            </dd>
          </div>
        </dl>
        )}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button variant="outline" className="h-11 w-full rounded-[12px] border-0 bg-surface-tint font-normal md:h-10 md:w-auto md:rounded-[10px] md:border md:bg-white md:px-4" onClick={() => setPlansOpen(true)}>
            Change plan
          </Button>
          {currentPlan !== "free" && (
            <button
              type="button"
              onClick={openPortal}
              disabled={openingPortal}
              className="flex items-center justify-center gap-1.5 rounded-sm text-sm text-text-secondary outline-none hover:text-text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 md:justify-start"
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
        <div className="flex items-baseline justify-between">
          <h2 id="invoices" className="font-display text-lg font-semibold text-text-primary">
            Invoices
          </h2>
          {billing && billing.invoices.length > 0 ? (
            <span className="text-xs text-text-secondary md:hidden">Showing last 3</span>
          ) : null}
        </div>
        {!billing ? (
          <p className="text-sm text-text-secondary">Loading invoices</p>
        ) : billing.invoices.length === 0 ? (
          <p className="text-sm text-text-secondary">No invoices yet.</p>
        ) : (
          <ul className="divide-y divide-line rounded-[16px] border border-line bg-white">
            {billing.invoices.map((invoice, index) => (
              <li key={invoice.id} className={index >= 3 ? "hidden md:flex md:items-center md:gap-3 md:px-5 md:py-3.5 md:text-sm" : "px-4 py-3.5 text-sm md:flex md:items-center md:gap-3 md:px-5"}>
                <div className="flex items-start justify-between gap-3 md:hidden">
                  <div>
                    <p className="flex items-center gap-2 font-display font-semibold text-text-primary">
                      {invoice.date}
                      <InvoiceStatus status={invoice.status} />
                    </p>
                    <p className="pt-0.5 text-text-secondary">
                      {invoice.amount} · {selected.name}
                    </p>
                  </div>
                  {invoice.pdf ? <InvoiceDownload invoice={invoice} iconOnly /> : null}
                </div>
                <div className="hidden md:contents">
                  <ReceiptText className="size-4 text-text-secondary" aria-hidden />
                  <span className="flex-1 text-text-primary">{invoice.date}</span>
                  <span className="text-text-primary">{invoice.amount}</span>
                  <InvoiceStatus status={invoice.status} />
                  {invoice.pdf ? <InvoiceDownload invoice={invoice} /> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
        <Lock className="size-3" aria-hidden />
        {t("planStripe")}
      </p>

      <PlansDialog
        open={plansOpen}
        onOpenChange={setPlansOpen}
        onNotNow={() => {}}
        title={t("planChange")}
        description={t("planSwitch")}
        currentPlan={currentPlan}
        onPlanSaved={(plan) => {
          setCurrentPlan(plan);
          refreshBilling();
        }}
      />
    </SettingsPage>
  );
}

function InvoiceStatus({ status }: { status: BillingInvoice["status"] }) {
  return (
    <span
      className={
        status === "Paid"
          ? "rounded-full bg-success-tint px-2 py-0.5 font-display text-xs font-semibold text-success"
          : "rounded-full bg-surface-page px-2 py-0.5 font-display text-xs font-semibold text-text-secondary"
      }
    >
      {status}
    </span>
  );
}

function InvoiceDownload({ invoice, iconOnly = false }: { invoice: BillingInvoice; iconOnly?: boolean }) {
  if (!invoice.pdf) return null;
  return (
    <a
      href={invoice.pdf}
      target="_blank"
      rel="noreferrer"
      aria-label={`Download invoice ${invoice.date}`}
      className="flex items-center gap-1 rounded-sm text-text-secondary hover:text-text-primary hover:underline"
    >
      <Download className="size-3.5" aria-hidden />
      {iconOnly ? <span className="sr-only">Download</span> : "Download"}
    </a>
  );
}
