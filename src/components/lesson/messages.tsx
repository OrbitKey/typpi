"use client";

import { Check, Info, Languages, Pencil, X, Zap } from "lucide-react";
import { useState } from "react";

import { Avatar } from "@/components/chat/avatar";
import type { RubyLine } from "@/lib/lesson";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */

export function Timestamp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full justify-center">
      <span className="rounded-full bg-slate-100 px-3 py-1 font-display text-xs leading-4 font-medium text-text-secondary/70">
        {children}
      </span>
    </div>
  );
}

/** Japanese text with furigana as ruby units (17/26 base, 12/14 reading). */
export function RubyText({ lines, furigana }: { lines: RubyLine[]; furigana: boolean }) {
  return (
    <div lang="ja" className="flex flex-col gap-0.5 font-jp text-[17px] leading-[26px] text-text-primary">
      {lines.map((line, i) => (
        <p key={i}>
          {line.map((seg, j) =>
            seg.ruby ? (
              <ruby key={j} className="[ruby-position:over]">
                {seg.text}
                <rt className={cn("text-xs leading-[14px] text-text-secondary", !furigana && "invisible")}>
                  {seg.ruby}
                </rt>
              </ruby>
            ) : (
              <span key={j}>{seg.text}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

/** Three dots shown for 1.5s before the character answers. */
export function TypingMessage({ avatar, name }: { avatar: string; name: string }) {
  return (
    <div className="flex w-full max-w-[560px] items-start gap-3" aria-live="polite">
      <span className="mt-1 shrink-0 rounded-full shadow-[0_0_0_1px_#e2e8f0]">
        <Avatar src={avatar} alt="" size={40} />
      </span>
      <div className="flex h-11 items-center gap-1 rounded-2xl rounded-tl-[2px] border border-slate-200 bg-white px-4">
        <span className="sr-only">{name} is typing</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-text-secondary motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Incoming message from a character: avatar + white card bubble + helper chips. */
export function CharacterMessage({
  avatar,
  name,
  lines,
  romaji,
  translation,
  showTranslation,
  withChips = true,
}: {
  avatar: string;
  name: string;
  lines: RubyLine[];
  romaji: string;
  translation: string;
  /** Global translation toggle (header 文/A button) */
  showTranslation: boolean;
  withChips?: boolean;
}) {
  const [furigana, setFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [translate, setTranslate] = useState(false);
  const translationVisible = showTranslation || translate;

  return (
    <div className="flex w-full max-w-[560px] flex-col gap-1.5 md:flex-row md:items-start md:gap-3">
      <span className="flex items-center gap-2 md:mt-1 md:block">
        <span className="shrink-0 rounded-full shadow-[0_0_0_1px_#e2e8f0]">
          <Avatar src={avatar} alt="" size={32} className="md:hidden" />
          <Avatar src={avatar} alt={name} size={40} className="hidden md:inline-flex" />
        </span>
        <span className="font-display text-sm leading-5 font-semibold text-text-primary md:hidden">{name}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 rounded-2xl rounded-tl-[2px] border border-slate-200 bg-white p-3.5 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] md:p-[17px]">
          <RubyText lines={lines} furigana={furigana} />
          {showRomaji && (
            <p className="font-display text-[13px] leading-5 text-text-secondary italic">{romaji}</p>
          )}
          {translationVisible && (
            <p className="border-t border-slate-100 pt-[9px] font-display text-sm leading-5 text-text-secondary">
              {translation}
            </p>
          )}
        </div>

        {withChips && (
          <div className="flex flex-wrap items-center gap-2 pl-1">
            <HelperChip active={furigana} onClick={() => setFurigana((v) => !v)}>
              {furigana ? <Check className="size-3 md:hidden" strokeWidth={3} aria-hidden /> : null}
              <span lang="ja" className="hidden text-[10px] leading-none font-bold md:inline">
                あ
              </span>
              Furigana
            </HelperChip>
            <HelperChip active={showRomaji} onClick={() => setShowRomaji((v) => !v)}>
              <span>Aa</span>
              Romaji
            </HelperChip>
            <HelperChip active={translate} onClick={() => setTranslate((v) => !v)}>
              <Languages className="size-3.5" aria-hidden />
              Translate
            </HelperChip>
          </div>
        )}
      </div>
    </div>
  );
}

function HelperChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs leading-4 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active
          ? "bg-brand-primary font-semibold text-white"
          : "bg-slate-100 font-medium text-text-secondary hover:bg-slate-200"
      )}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */

/** Unsent draft (dashed). `children` is the rendered draft text. */
export function DraftBubble({
  children,
  error,
  errorTip,
  onRetry,
}: {
  children: React.ReactNode;
  error?: boolean;
  errorTip?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-end gap-1.5">
      <div
        className={cn(
          "rounded-2xl rounded-tr-[2px] border px-4 py-3 font-jp text-[17px] leading-[27.63px] font-medium text-text-primary md:border-2 md:border-dashed md:px-[22px] md:py-[14px]",
          error ? "border-error-line bg-error-tint" : "border-draft-line bg-surface-tint"
        )}
      >
        {children}
      </div>
      <p className="hidden items-center gap-1 pr-1 font-display text-xs leading-4 font-medium text-text-secondary md:flex">
        <Pencil className="size-3.5" aria-hidden />
        Draft · not sent yet
      </p>
      {errorTip && (
        <div
          role="alert"
          className="mt-2 flex items-center gap-3 rounded-[12px] border border-error-line bg-error-tint py-[6px] pr-3 pl-2.5 font-display text-[13px] leading-[17px] text-error"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <X className="size-3.5" strokeWidth={2.5} aria-hidden />
            <span lang="ja-Latn">{errorTip}</span>
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="hidden rounded-sm text-xs leading-4 font-semibold text-text-primary underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Sent message with success feedback (stamp + XP + praise). */
export function SentBubble({
  text,
  sentAt,
  stamp,
  xp,
  praise,
}: {
  text: string;
  sentAt: string;
  stamp: string[];
  xp: number;
  praise: string;
}) {
  return (
    <div className="flex w-full flex-col items-end gap-1.5">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tr-[2px] border border-draft-line bg-surface-tint px-[22px] py-[12px]">
        <span lang="ja" className="font-jp text-[17px] leading-7 font-medium text-text-primary">
          {text}
        </span>
        <span className="flex size-4 items-center justify-center rounded-full bg-success text-white">
          <Check className="size-2.5" strokeWidth={3.5} aria-label="Sent" />
        </span>
      </div>
      <p className="hidden pr-1 font-display text-xs leading-[17px] font-medium text-text-secondary md:block">
        Sent · {sentAt}
      </p>

      <div className="mt-1 flex w-full flex-wrap items-center gap-2 self-start md:hidden" aria-live="polite">
        <Stamp stamp={stamp} />
        <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2 py-0.5 font-display text-xs leading-4 font-semibold text-amber-900">
          +{xp} XP
        </span>
        <span className="min-w-0 font-display text-xs leading-4 text-text-secondary">{praise}</span>
      </div>

      <div className="mt-3 hidden items-center gap-3 pt-1 md:flex" aria-live="polite">
        <Stamp stamp={stamp} />
        <span className="flex flex-col items-start gap-1">
          <span className="rounded-full border border-amber-200/80 bg-amber-50 px-2 py-0.5 font-display text-xs leading-4 font-semibold text-amber-900">
            ⭐ +{xp} XP
          </span>
          <span className="max-w-[160px] font-display text-xs leading-4 text-text-secondary">
            {praise}
          </span>
        </span>
      </div>
    </div>
  );
}

function Stamp({ stamp }: { stamp: string[] }) {
  return (
    <span
      lang="ja"
      aria-label={stamp.join("")}
      className="flex size-10 shrink-0 -rotate-12 flex-col items-center justify-center rounded-full border-2 border-action-accent text-center font-jp text-[11px] leading-[12px] font-bold text-action-accent"
    >
      {stamp.map((s) => (
        <span key={s}>{s}</span>
      ))}
    </span>
  );
}

/** Phone-only task from Hana. On a wide screen the same task stays pinned above the keyboard. */
export function TaskBubble({
  avatar,
  goal,
  glossary,
  xp,
  done,
}: {
  avatar: string;
  goal: string;
  glossary: { ja: string; en: string }[];
  xp: number;
  done?: boolean;
}) {
  if (done) {
    return (
      <div className="md:hidden">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-tint px-3 py-1.5 font-display text-[13px] leading-5 font-medium text-success">
          <Check className="size-3.5" strokeWidth={3} aria-hidden />
          {goal}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-start gap-2.5 md:hidden">
      <span className="shrink-0 rounded-full shadow-[0_0_0_1px_#e2e8f0]">
        <Avatar src={avatar} alt="" size={36} />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl bg-bubble-guide px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-xs leading-4 font-bold tracking-[0.6px] text-[#6d28d9]">HANA</span>
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-display text-xs leading-4 font-semibold text-amber-900">
            <Zap className="size-3" aria-hidden />+{xp} XP
          </span>
        </div>
        <p className="pt-1.5 text-[15px] leading-[22px] font-medium text-text-primary">{goal}</p>
        <p className="pt-1 text-xs leading-[18px] text-text-secondary">
          Hint:{" "}
          {glossary.map((g, i) => (
            <span key={g.ja}>
              {i > 0 && " · "}
              <span lang="ja" className="font-jp">
                {g.ja}
              </span>{" "}
              = {g.en}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Hint from the guide, inserted in the stream under the draft. */
export function HintMessage({
  avatar,
  index,
  max,
  cost,
  children,
  steps,
  currentStep,
}: {
  avatar: string;
  index: number;
  max: number;
  cost: number;
  children: React.ReactNode;
  steps?: string[];
  currentStep?: number;
}) {
  const left = max - index;
  return (
    <div className="flex w-full items-start gap-3" aria-live="polite">
      <span className="shrink-0 rounded-full shadow-[0_0_0_1px_#e2e8f0]">
        <Avatar src={avatar} alt="Hana" size={40} />
      </span>
      <div className="flex w-full max-w-[460px] flex-col gap-2 rounded-2xl rounded-tl-[2px] bg-bubble-guide px-4 pt-3 pb-3.5">
        <div className="flex items-center gap-2 font-display">
          <span className="text-xs leading-4 font-semibold tracking-[0.2px] text-text-secondary uppercase">
            Hint {index} of {max}
          </span>
          <span className="rounded-full bg-white px-2 py-0.5 text-xs leading-4 font-semibold text-error">
            −{cost} XP
          </span>
        </div>
        <p className="text-[15px] leading-[22px] text-ink">{children}</p>
        {steps && (
          <ol className="flex flex-wrap gap-1.5" aria-label="Romaji steps">
            {steps.map((s, i) => (
              <li
                key={s + i}
                className={cn(
                  "rounded-md px-2.5 py-0.5 font-display text-sm leading-5 font-semibold",
                  i < (currentStep ?? 0) && "bg-white/60 text-text-secondary",
                  i === currentStep && "bg-action-accent text-white",
                  i > (currentStep ?? 0) && "bg-white text-text-primary"
                )}
              >
                {s}
              </li>
            ))}
          </ol>
        )}
        <p className="font-display text-xs leading-[18px] text-text-secondary">
          {left > 0
            ? `${left} hint${left === 1 ? "" : "s"} left · Tab for the next hint`
            : "No hints left"}
        </p>
      </div>
    </div>
  );
}

export function CultureTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full gap-3 rounded-2xl border border-line-panel bg-surface-page px-4 py-3">
      <Info className="mt-0.5 size-5 shrink-0 text-icon-default" aria-hidden />
      <div>
        <p className="font-display text-xs leading-4 font-semibold text-text-secondary">Culture tip</p>
        <p className="pt-0.5 text-[15px] leading-[22px] text-text-primary">{children}</p>
      </div>
    </div>
  );
}
