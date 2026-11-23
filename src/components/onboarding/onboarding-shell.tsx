import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * Segmented progress bar (3 segments, 4px high, 4px gap).
 * `value` is in segments, so 2.5 = two full segments + half of the third.
 */
export function SegmentedProgress({
  value,
  segments = 3,
  label,
}: {
  value: number;
  segments?: number;
  label: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={segments}
      aria-valuenow={value}
      className="flex h-1 w-full gap-1 md:mx-auto md:max-w-[576px]"
    >
      {Array.from({ length: segments }, (_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span
            key={i}
            className="relative h-full flex-1 overflow-hidden rounded-[2px] bg-surface-accent-tint"
          >
            <span
              className="absolute inset-y-0 left-0 rounded-[2px] bg-action-accent transition-[width] duration-500 motion-reduce:transition-none"
              style={{ width: `${fill * 100}%` }}
            />
          </span>
        );
      })}
    </div>
  );
}

/**
 * Onboarding page frame (D-ONB-01…04):
 * - blurred header with the Large logo + step progress
 * - white chat panel (640 wide, 100vh − 160px, min 480px) that scrolls
 * - CTA floats 32px above the panel bottom with a 150px white fade
 */
export function OnboardingShell({
  progress,
  mobileProgress,
  stepLabel,
  backHref,
  cta,
  children,
}: {
  progress: number;
  /** Phone frames fill the current step's segment. Desktop keeps `progress`. */
  mobileProgress?: number;
  stepLabel: string;
  backHref?: string;
  cta: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-white md:min-h-screen md:bg-surface-page md:px-4 md:pt-[120px] md:pb-10">
      <header className="sticky top-0 z-20 bg-white md:absolute md:inset-x-0 md:z-10 md:bg-transparent md:backdrop-blur-[12px]">
        <div className="flex h-14 w-full items-center gap-3 px-4 md:mx-auto md:h-[84px] md:max-w-[640px] md:justify-center md:px-8">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Back"
              className="flex size-8 items-center justify-center rounded-full text-ink outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </Link>
          ) : null}
          <span className="inline-flex items-center gap-1.5 md:hidden">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-action-accent" />
            <span className="font-display text-[18px] leading-none font-bold tracking-[-0.18px] text-text-primary">
              Typpi
            </span>
          </span>
          <Logo size="large" className="hidden md:inline-flex" />
        </div>
        <div className="px-5 pb-3 md:px-0 md:pb-1">
          {mobileProgress === undefined ? (
            <SegmentedProgress value={progress} label={stepLabel} />
          ) : (
            <>
              <div className="md:hidden">
                <SegmentedProgress value={mobileProgress} label={stepLabel} />
              </div>
              <div className="hidden md:block">
                <SegmentedProgress value={progress} label={stepLabel} />
              </div>
            </>
          )}
        </div>
      </header>

      <main className="relative mx-auto w-full md:h-[calc(100vh-160px)] md:min-h-[480px] md:max-w-[640px] md:overflow-hidden md:rounded-3xl md:border md:border-line-panel md:bg-surface-default">
        <div className="px-4 pt-2 pb-28 md:h-full md:overflow-y-auto md:overscroll-contain md:px-8 md:pt-8 md:pb-[120px] md:[scroll-padding-bottom:120px]">
          {children}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[150px] bg-gradient-to-b from-white/0 via-white/95 via-55% to-white md:block"
        />
        <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] md:absolute md:inset-x-8 md:bottom-8 md:bg-transparent md:p-0 md:pt-1">
          {cta}
        </div>
      </main>
    </div>
  );
}

/** Vertical stack used for the chat content inside the panel. */
export function ChatStack({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}
