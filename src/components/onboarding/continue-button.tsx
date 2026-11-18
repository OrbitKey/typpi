"use client";

import { ArrowRight } from "lucide-react";
import { forwardRef } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";

/** Floating dark CTA used at the bottom of every onboarding step. */
export const ContinueButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { label?: string }
>(function ContinueButton({ label, ...props }, ref) {
  const { t } = useLocale();
  return (
    <Button ref={ref} size="cta" {...props}>
      {label ?? t("continue")}
      <ArrowRight className="size-[16px]" strokeWidth={2.25} aria-hidden />
    </Button>
  );
});
