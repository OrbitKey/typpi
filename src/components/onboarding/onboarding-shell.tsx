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
      className="flex h-1 w-full max-w-[576px] gap-1"
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
  stepLabel,
  cta,
  children,
}: {
  progress: number;
  stepLabel: string;
  cta: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-surface-page px-4 pt-[120px] pb-10">
      <header className="absolute inset-x-0 top-0 z-10 flex flex-col items-center pb-1 backdrop-blur-[12px]">
        <div className="flex h-[84px] w-full max-w-[640px] items-center justify-center px-8">
          <Logo size="large" />
        </div>
        <SegmentedProgress value={progress} label={stepLabel} />
      </header>

      <main className="relative mx-auto h-[calc(100vh-160px)] min-h-[480px] w-full max-w-[640px] overflow-hidden rounded-3xl border border-line-panel bg-surface-default">
        <div className="h-full overflow-y-auto overscroll-contain px-8 pt-8 pb-[120px] [scroll-padding-bottom:120px]">
          {children}
        </div>

        {/* Content scrolls under the floating CTA */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-b from-white/0 via-white/95 via-55% to-white"
        />
        <div className="absolute inset-x-8 bottom-8 pt-1">{cta}</div>
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
