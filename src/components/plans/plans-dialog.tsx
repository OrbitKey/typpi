"use client";

import { ArrowRight, Building2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/chat/avatar";
import { useLocale } from "@/components/i18n/locale-provider";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { MessageKey } from "@/lib/i18n";
import { characters } from "@/lib/characters";
import { plans, type PlanId } from "@/lib/plans";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const planName: Record<PlanId, MessageKey> = {
  free: "planFreeName",
  individual: "individual",
  premium: "premium",
};

const planCta: Record<PlanId, MessageKey> = {
  free: "planCurrent",
  individual: "planChooseIndividual",
  premium: "planChoosePremium",
};

const planFeature: Record<PlanId, MessageKey[]> = {
  free: [],
  individual: ["planAllLessons", "planMistake", "planProgress"],
  premium: ["planEverything", "planExtra"],
};

/**
 * D-PAY-01 · Paywall modal (880 wide, 24px radius, 40px padding).
 * role=dialog + aria-modal + focus trap via Radix; Esc / × = "Not now".
 */
export function PlansDialog({
  open,
  onOpenChange,
  onNotNow,
  title,
  description,
  currentPlan = "free",
  onPlanSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotNow: () => void;
  title?: string;
  description?: string;
  currentPlan?: PlanId;
  onPlanSaved?: (plan: PlanId) => void;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const heading = title ?? t("planFinished");
  const summary = description ?? t("planUnlockBody");
  const [saving, setSaving] = useState<PlanId | null>(null);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<PlanId>(currentPlan === "individual" ? "premium" : "individual");

  useEffect(() => {
    if (open) setPicked(currentPlan === "individual" ? "premium" : "individual");
  }, [open, currentPlan]);

  const choose = async (id: PlanId) => {
    if (id === currentPlan || saving) return;
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/signup?plan=${id}`);
      return;
    }
    setSaving(id);
    const here = new URL(window.location.href);
    here.searchParams.delete("session_id");
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: id, returnTo: here.pathname + here.search }),
    });
    const body = (await response.json().catch(() => null)) as { url?: string; plan?: PlanId; error?: string } | null;
    if (!response.ok || !body) {
      setSaving(null);
      setError(body?.error || t("planPayError"));
      return;
    }
    if (body.url) {
      window.location.assign(body.url);
      return;
    }
    setSaving(null);
    if (body.plan) {
      onPlanSaved?.(body.plan);
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) onNotNow();
      }}
    >
      <DialogContent className="max-w-none gap-0 overflow-y-auto p-5 shadow-none max-md:inset-0 max-md:top-0 max-md:left-0 max-md:h-dvh max-md:max-h-dvh max-md:translate-x-0 max-md:translate-y-0 max-md:rounded-none max-md:border-0 max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-none md:max-w-[880px] md:p-10 md:shadow-2xl max-md:[&_[data-slot=dialog-close]]:top-3 max-md:[&_[data-slot=dialog-close]]:right-auto max-md:[&_[data-slot=dialog-close]]:left-2">
        <div className="flex flex-col items-center pb-5 text-center md:pb-8">
          <span className="rounded-full border-2 border-bubble-guide-line">
            <Avatar src={characters.hana.avatar} alt="" size={56} className="md:hidden" />
            <Avatar src={characters.hana.avatar} alt="Hana" size={48} className="hidden md:inline-flex" />
          </span>
          <DialogTitle className="pt-4 text-[22px] leading-7 font-bold md:text-[26px] md:leading-9">{heading}</DialogTitle>
          <DialogDescription className="pt-1.5 text-[15px] leading-6">{summary}</DialogDescription>
        </div>

        <div className="flex flex-col gap-3 md:hidden">
          {(["individual", "free", "premium"] as PlanId[]).map((id) => {
            const plan = plans.find((item) => item.id === id)!;
            const isCurrent = plan.id === currentPlan;
            const expanded = picked === plan.id && plan.features.length > 0;
            if (!expanded) {
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setPicked(plan.id)}
                  aria-pressed={picked === plan.id}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-[16px] border px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    picked === plan.id ? "border-brand-primary bg-surface-tint" : "border-line bg-white"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] leading-5 font-semibold text-text-primary">{t(planName[plan.id])}</span>
                    <span className={cn("block text-[13px] leading-5 text-text-secondary", plan.id !== "premium" && "truncate")}>
                      {plan.id === "free" ? (
                        t("planFreeDesc")
                      ) : plan.id === "premium" ? (
                        <>
                          {t("planEverything")}
                          <br />+ {t("planExtra")}
                        </>
                      ) : (
                        t("planAllLessons")
                      )}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-display text-[15px] font-semibold text-text-primary">
                      {plan.price}
                      {plan.period ? plan.period.replace(" ", "") : ""}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-surface-page px-2 py-1 font-display text-[11px] font-medium text-text-secondary">
                        {t("planCurrent")}
                      </span>
                    )}
                  </span>
                </button>
              );
            }
            return (
              <div key={plan.id} className="relative rounded-[20px] bg-surface-tint px-4 py-4">
                {plan.highlighted && (
                  <span className="absolute top-4 right-4 rounded-full bg-brand-secondary px-2 py-1 font-display text-[10px] leading-none font-bold tracking-[0.4px] text-white uppercase">
                    {t("planMostPopular")}
                  </span>
                )}
                <p className="font-display text-[15px] font-semibold text-text-primary">{t(planName[plan.id])}</p>
                <p className="flex items-baseline gap-1 pt-1 font-display">
                  <span className="text-[22px] leading-7 font-bold text-text-primary">{plan.price}</span>
                  {plan.period && <span className="text-sm text-text-secondary">{t("planPerMonth")}</span>}
                </p>
                <ul className="flex flex-col gap-2 pt-3">
                  {plan.features.map((feature, index) => (
                    <li key={feature.label} className="flex items-center gap-2 text-sm text-text-primary">
                      <Check className="size-4 shrink-0 text-text-primary" strokeWidth={2.25} aria-hidden />
                      {t(planFeature[plan.id][index] ?? "planExtra")}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <button
            type="button"
            disabled={picked === currentPlan || saving !== null}
            onClick={() => choose(picked)}
            className="mt-1 flex h-12 w-full items-center justify-center gap-1.5 rounded-[14px] bg-brand-primary font-display text-[15px] font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {picked === currentPlan ? t("planCurrent") : saving === picked ? t("planOpening") : t(planCta[picked])}
            {picked !== currentPlan && saving !== picked && <ArrowRight className="size-4" aria-hidden />}
          </button>
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-3">
          {plans.map((p) => {
            const isCurrent = p.id === currentPlan;
            return (
              <div
                key={p.id}
                className={cn(
                  "relative flex min-h-[290px] flex-col rounded-[20px] border bg-white p-6",
                  p.highlighted ? "border-2 border-ink shadow-[0_8px_24px_-12px_rgba(36,42,48,0.35)]" : "border-line"
                )}
              >
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-secondary-text px-3 py-1 font-display text-[11px] leading-[15px] font-bold tracking-[0.6px] whitespace-nowrap text-white">
                    {t("planMostPopular")}
                  </span>
                )}
                <p className="font-display text-sm leading-5 font-semibold text-text-primary">{t(planName[p.id])}</p>
                <p className="flex items-baseline gap-1 pt-4 font-display">
                  <span className="text-[28px] leading-9 font-bold text-text-primary">{p.price}</span>
                  {p.period && <span className="text-sm text-text-secondary">{t("planPerMonth")}</span>}
                </p>
                {p.description && <p className="pt-4 text-sm leading-5 text-text-secondary">{t("planFreeDesc")}</p>}
                <ul className="flex flex-1 flex-col gap-2.5 pt-4 pb-6">
                  {p.features.map((f, index) => (
                    <li
                      key={f.label}
                      className={cn("flex gap-2 text-sm leading-5", f.soon ? "text-text-secondary" : "text-text-primary")}
                    >
                      <Check
                        className={cn("mt-0.5 size-4 shrink-0", f.soon ? "text-text-secondary" : "text-success")}
                        strokeWidth={2.25}
                        aria-hidden
                      />
                      {t(planFeature[p.id][index] ?? "planExtra")}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={isCurrent || saving !== null}
                  onClick={() => choose(p.id)}
                  className={cn(
                    "h-[38px] rounded-[10px] font-display text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isCurrent
                      ? "cursor-default border border-line bg-surface-page text-text-secondary"
                      : p.highlighted
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                        : "border border-brand-primary bg-white text-text-primary hover:bg-surface-page"
                  )}
                >
                  {isCurrent ? t("planCurrent") : saving === p.id ? (p.id === "free" ? t("saving") : t("planOpening")) : t(planCta[p.id])}
                </button>
              </div>
            );
          })}
        </div>

        {error ? (
          <p role="alert" className="pt-4 text-center text-sm text-error">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col items-center gap-3 pt-4 text-center md:gap-2 md:pt-7">
          <p className="text-sm leading-5 text-text-secondary">{t("planPay")}</p>
          {/* TODO: employer / team plan page */}
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-sm font-display text-sm font-medium text-text-primary underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring md:no-underline md:hover:underline"
          >
            <Building2 className="hidden size-4 md:block" aria-hidden />
            {t("planEmployer")}
          </a>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onNotNow();
            }}
            className="mt-1 rounded-sm px-2 py-1 font-display text-sm font-medium text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring md:mt-2 md:text-text-accent md:underline md:underline-offset-2"
          >
            {t("planNotNow")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
