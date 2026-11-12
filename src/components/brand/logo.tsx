import { cn } from "@/lib/utils";

/**
 * Brand logo (Figma component "Logo", node 82:38).
 * Dot goes AFTER the wordmark. Sizes: Small 18 (rails), Medium 28 (sign-up),
 * Large 44 (onboarding header). Do not redraw.
 */
const sizes = {
  small: { text: "text-[18px] leading-[18px] tracking-[-0.18px]", dot: "size-[6px]", gap: "gap-[3px]" },
  medium: { text: "text-[28px] leading-[28px] tracking-[-0.28px]", dot: "size-[9px]", gap: "gap-1" },
  large: { text: "text-[44px] leading-[44px] tracking-[-0.44px]", dot: "size-[14px]", gap: "gap-1.5" },
} as const;

export function Logo({
  size = "large",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <span className={cn("font-display font-bold text-text-primary", s.text)}>
        Typpi
      </span>
      <span
        aria-hidden
        className={cn("shrink-0 rounded-full bg-action-accent", s.dot)}
      />
    </span>
  );
}
