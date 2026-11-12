"use client";

import { Check } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Card-style radio options built on the shadcn/Radix RadioGroup primitive
 * (arrow keys move the selection, Space selects, proper radiogroup semantics).
 */
export function ChoiceGroup({
  value,
  onValueChange,
  label,
  className,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      aria-label={label}
      className={className}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
}

/* --------------------------------------------------------------------------
 * Purpose option (D-ONB-02): full-width row card with media + check.
 * ----------------------------------------------------------------------- */
export function OptionCard({
  value,
  title,
  description,
  media,
  selected,
}: {
  value: string;
  title: string;
  description: string;
  media: React.ReactNode;
  selected: boolean;
}) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border-2 p-[18px] text-left drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-ink-strong bg-card-selected"
          : "border-line-panel bg-white hover:bg-surface-page"
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-4">
        <span className="size-12 shrink-0">{media}</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[17px] leading-[25.5px] font-semibold text-ink">{title}</span>
          <span className="pt-0.5 text-sm leading-[21px] text-muted-ink">{description}</span>
        </span>
      </span>
      <span className="pl-3">
        {selected ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-brand-primary text-white">
            <Check className="size-[13px]" strokeWidth={3} aria-hidden />
          </span>
        ) : (
          <span className="block size-6 rounded-full border-[1.5px] border-icon-default" />
        )}
      </span>
    </RadioGroupPrimitive.Item>
  );
}

/* --------------------------------------------------------------------------
 * Level tile (D-ONB-03): equal-width tiles, check in the top-right corner.
 * ----------------------------------------------------------------------- */
export function LevelTile({
  value,
  title,
  description,
  selected,
}: {
  value: string;
  title: string;
  description: string;
  selected: boolean;
}) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      className={cn(
        "flex min-h-[140px] min-w-0 flex-1 flex-col gap-5 rounded-2xl border p-[17px] text-left drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-brand-primary bg-surface-tint"
          : "border-line-soft bg-white hover:bg-surface-page"
      )}
    >
      <span className="flex h-8 w-full items-start justify-end pt-0.5">
        {selected && (
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-white">
            <Check className="size-[11px]" strokeWidth={3} aria-hidden />
          </span>
        )}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[17px] leading-[21.25px] font-semibold text-ink">{title}</span>
        <span className="text-sm leading-[19.25px] text-muted-ink">{description}</span>
      </span>
    </RadioGroupPrimitive.Item>
  );
}
