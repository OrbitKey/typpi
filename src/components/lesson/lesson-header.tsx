import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Avatar } from "@/components/chat/avatar";
import { cn } from "@/lib/utils";

/** Chat header: partner, 6-step progress, XP badge, translation toggle. */
export function LessonHeader({
  name,
  subtitle,
  avatar,
  step,
  totalSteps,
  xp,
  translations,
  onToggleTranslations,
  done = false,
}: {
  name: string;
  subtitle: string;
  avatar: string;
  /** Number of completed steps */
  step: number;
  totalSteps: number;
  xp: number;
  translations: boolean;
  onToggleTranslations: () => void;
  /** Lesson finished (D-END-01/02): check badge, all segments ink, plain count */
  done?: boolean;
}) {
  const role = subtitle.split(" · ")[0];

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-[12px]">
      <div className="px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2.5 md:hidden">
        <div className="flex items-center gap-2">
          <Link
            href="/chats"
            aria-label="Back"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
          <span className="relative shrink-0 rounded-full shadow-[0_0_0_1px_#e2e8f0]">
            <Avatar src={avatar} alt="" size={36} />
            {done && (
              <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-success">
                <Check className="size-2 text-white" strokeWidth={4} aria-hidden />
              </span>
            )}
          </span>
          <div className="min-w-0 flex-1 font-display">
            <h1 className="truncate text-[15px] leading-5 font-bold text-text-primary">{name}</h1>
            <p className="truncate text-[13px] leading-4 text-text-secondary">{role}</p>
          </div>
          <XpBadge xp={xp} />
        </div>
        <Progress
          step={step}
          totalSteps={totalSteps}
          done={done}
          className="mt-2.5"
          trackClassName="flex-1"
          segmentsClassName="h-1.5 flex-1"
          filledClassName="bg-action-accent"
        />
      </div>

      <div className="hidden h-[72px] items-center justify-between px-8 md:flex">
        <div className="flex items-center gap-3 font-display">
          <span className="relative rounded-full shadow-[0_0_0_1px_#e2e8f0,0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <Avatar src={avatar} alt="" size={40} />
            {done && (
              <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-success">
                <Check className="size-2 text-white" strokeWidth={4} aria-hidden />
              </span>
            )}
          </span>
          <div>
            <h1 className="text-base leading-5 font-bold text-text-primary">{name}</h1>
            <p className="text-[13px] leading-[16.25px] text-text-secondary">{subtitle}</p>
          </div>
        </div>

        <Progress
          step={step}
          totalSteps={totalSteps}
          done={done}
          segmentsClassName={done ? "w-8" : "w-6"}
          filledClassName="bg-brand-primary"
          currentClassName="bg-action-accent"
          countClassName={cn(!done && "rounded-full bg-slate-100 px-2 py-0.5")}
        />

        <div className="flex items-center gap-3">
          <XpBadge xp={xp} />
          <button
            type="button"
            aria-pressed={translations}
            aria-label="Show translations"
            onClick={onToggleTranslations}
            className={cn(
              "flex size-9 items-center justify-center rounded-[12px] border font-jp text-sm leading-5 font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring",
              translations ? "border-slate-200 text-text-secondary" : "border-slate-200 bg-slate-100 text-slate-400"
            )}
          >
            文/A
          </button>
        </div>
      </div>
    </header>
  );
}

function XpBadge({ xp }: { xp: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 font-display text-[13px] leading-4 font-semibold text-amber-900 md:gap-1.5 md:px-[13px] md:py-[7px] md:leading-[19.5px]">
      <span aria-hidden>⭐</span>
      {xp} XP
    </span>
  );
}

function Progress({
  step,
  totalSteps,
  done,
  className,
  trackClassName,
  segmentsClassName,
  filledClassName,
  currentClassName,
  countClassName,
}: {
  step: number;
  totalSteps: number;
  done: boolean;
  className?: string;
  trackClassName?: string;
  segmentsClassName: string;
  filledClassName: string;
  currentClassName?: string;
  countClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={step}
        className={cn("flex gap-1.5", trackClassName)}
      >
        {Array.from({ length: totalSteps }, (_, i) => {
          const filled = done
            ? true
            : currentClassName
              ? i < step - 1
              : i < step;
          const current = !done && currentClassName && i === step - 1;
          return (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-colors",
                segmentsClassName,
                filled ? filledClassName : current ? currentClassName : "bg-slate-200"
              )}
            />
          );
        })}
      </div>
      <span className={cn("font-display text-xs leading-4 font-bold text-text-primary", countClassName)}>
        {step}/{totalSteps}
      </span>
    </div>
  );
}
