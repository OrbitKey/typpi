"use client";

import { Building2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <DialogContent className="max-w-[880px] gap-0 p-10 sm:max-w-[880px]">
        <div className="flex flex-col items-center pb-8 text-center">
          <span className="rounded-full border-2 border-bubble-guide-line">
            <Avatar src={characters.hana.avatar} alt="Hana" size={48} />
          </span>
          <DialogTitle className="pt-4 text-[26px] leading-9 font-bold">{heading}</DialogTitle>
          <DialogDescription className="pt-1.5 text-[15px] leading-6">{summary}</DialogDescription>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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

        <div className="flex flex-col items-center gap-2 pt-7 text-center">
          <p className="text-sm leading-5 text-text-secondary">{t("planPay")}</p>
          {/* TODO: employer / team plan page */}
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-sm font-display text-sm font-medium text-text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Building2 className="size-4" aria-hidden />
            {t("planEmployer")}
          </a>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onNotNow();
            }}
            className="mt-2 rounded-sm px-2 py-1 font-display text-sm font-medium text-text-accent underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("planNotNow")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
