"use client";

import { ArrowRight } from "lucide-react";
import { forwardRef } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Floating dark CTA used at the bottom of every onboarding step. */
export const ContinueButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { label?: string; hideArrowOnMobile?: boolean }
>(function ContinueButton({ label, hideArrowOnMobile, className, ...props }, ref) {
  const { t } = useLocale();
  return (
    <Button ref={ref} size="cta" className={className} {...props}>
      {label ?? t("continue")}
      <ArrowRight
        className={cn("size-[16px]", hideArrowOnMobile && "max-md:hidden")}
        strokeWidth={2.25}
        aria-hidden
      />
    </Button>
  );
});
