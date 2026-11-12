"use client";

import { Building2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/chat/avatar";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { characters } from "@/lib/characters";
import { plans, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

/**
 * D-PAY-01 · Paywall modal (880 wide, 24px radius, 40px padding).
 * role=dialog + aria-modal + focus trap via Radix; Esc / × = "Not now".
 */
export function PlansDialog({
  open,
  onOpenChange,
  onNotNow,
  title = "You've finished 3 lessons – great start!",
  description = "Unlock every section and keep practising real messages.",
  currentPlan = "free",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotNow: () => void;
  title?: string;
  description?: string;
  currentPlan?: PlanId;
}) {
  const router = useRouter();

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
          <DialogTitle className="pt-4 text-[26px] leading-9 font-bold">{title}</DialogTitle>
          <DialogDescription className="pt-1.5 text-[15px] leading-6">{description}</DialogDescription>
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
                    MOST POPULAR
                  </span>
                )}
                <p className="font-display text-sm leading-5 font-semibold text-text-primary">{p.name}</p>
                <p className="flex items-baseline gap-1 pt-4 font-display">
                  <span className="text-[28px] leading-9 font-bold text-text-primary">{p.price}</span>
                  {p.period && <span className="text-sm text-text-secondary">{p.period}</span>}
                </p>
                {p.description && <p className="pt-4 text-sm leading-5 text-text-secondary">{p.description}</p>}
                <ul className="flex flex-1 flex-col gap-2.5 pt-4 pb-6">
                  {p.features.map((f) => (
                    <li
                      key={f.label}
                      className={cn("flex gap-2 text-sm leading-5", f.soon ? "text-text-secondary" : "text-text-primary")}
                    >
                      <Check
                        className={cn("mt-0.5 size-4 shrink-0", f.soon ? "text-text-secondary" : "text-success")}
                        strokeWidth={2.25}
                        aria-hidden
                      />
                      {f.label}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => router.push(`/signup?plan=${p.id}`)}
                  className={cn(
                    "h-[38px] rounded-[10px] font-display text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isCurrent
                      ? "cursor-default border border-line bg-surface-page text-text-secondary"
                      : p.highlighted
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                        : "border border-brand-primary bg-white text-text-primary hover:bg-surface-page"
                  )}
                >
                  {isCurrent ? "Current plan" : p.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 pt-7 text-center">
          <p className="text-sm leading-5 text-text-secondary">Pay by card, Apple Pay or Google Pay</p>
          {/* TODO: employer / team plan page */}
          <a
            href="#"
            className="flex items-center gap-1.5 rounded-sm font-display text-sm font-medium text-text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Building2 className="size-4" aria-hidden />
            Get Typpi through your employer
          </a>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              onNotNow();
            }}
            className="mt-2 rounded-sm px-2 py-1 font-display text-sm font-medium text-text-accent underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Not now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
