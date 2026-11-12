"use client";

import { CreditCard, Download, ExternalLink, Lock, ReceiptText } from "lucide-react";
import { useState } from "react";

import { PlansDialog } from "@/components/plans/plans-dialog";
import { SettingsPage } from "@/components/settings/settings-nav";
import { Button } from "@/components/ui/button";

// SAMPLE DATA (D-SET-02)
const invoices = ["Nov 9, 2026", "Oct 9, 2026", "Sep 9, 2026"];

/** D-SET-02 · Subscription */
export default function SubscriptionSettings() {
  const [plansOpen, setPlansOpen] = useState(false);

  return (
    <SettingsPage title="Subscription" width={640}>
      <section className="rounded-[20px] border border-line bg-white px-6 py-5 shadow-xs">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-text-primary">Individual</span>
            <span className="rounded-full bg-success-tint px-2 py-0.5 font-display text-xs font-semibold text-success">Active</span>
          </p>
          <p className="font-display">
            <span className="text-lg font-bold text-text-primary">$7.99</span>
            <span className="text-sm text-text-secondary">/ month</span>
          </p>
        </div>
        <dl className="mt-4 flex flex-col gap-3 border-y border-line py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Next payment</dt>
            <dd className="text-text-primary">December 9, 2026</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Payment method</dt>
            <dd className="flex items-center gap-1.5 text-text-primary">
              <CreditCard className="size-4 text-text-secondary" aria-hidden />
              Visa •••• 4242
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" className="h-10 rounded-[10px] px-4 font-normal" onClick={() => setPlansOpen(true)}>
            Change plan
          </Button>
          {/* TODO(backend): Stripe customer portal */}
          <a href="#" className="flex items-center gap-1.5 rounded-sm text-sm text-text-secondary hover:text-text-primary hover:underline">
            Manage or cancel
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </section>

      <section aria-labelledby="invoices" className="flex flex-col gap-3 pt-4">
        <h2 id="invoices" className="font-display text-lg font-semibold text-text-primary">
          Invoices
        </h2>
        <ul className="divide-y divide-line rounded-[16px] border border-line bg-white">
          {invoices.map((d) => (
            <li key={d} className="flex items-center gap-3 px-5 py-3.5 text-sm">
              <ReceiptText className="size-4 text-text-secondary" aria-hidden />
              <span className="flex-1 text-text-primary">{d}</span>
              <span className="text-text-primary">$7.99</span>
              <span className="rounded-full bg-success-tint px-2 py-0.5 font-display text-xs font-semibold text-success">Paid</span>
              <a
                href="#"
                aria-label={`Download invoice ${d}`}
                className="flex items-center gap-1 rounded-sm text-text-secondary hover:text-text-primary hover:underline"
              >
                <Download className="size-3.5" aria-hidden />
                Download
              </a>
            </li>
          ))}
        </ul>
      </section>

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
        currentPlan="individual"
      />
    </SettingsPage>
  );
}
