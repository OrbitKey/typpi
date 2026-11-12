import { Check } from "lucide-react";

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
  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur-[12px]">
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

      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={step}
          className="flex gap-1.5"
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-colors",
                done ? "w-8 bg-brand-primary" : "w-6",
                !done && (i < step - 1 ? "bg-brand-primary" : i === step - 1 ? "bg-action-accent" : "bg-slate-200")
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "font-display text-xs leading-4 font-bold text-text-primary",
            !done && "rounded-full bg-slate-100 px-2 py-0.5"
          )}
        >
          {step}/{totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-[13px] py-[7px] font-display text-[13px] leading-[19.5px] font-semibold text-amber-900">
          <span aria-hidden>⭐</span>
          {xp} XP
        </span>
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
    </header>
  );
}
