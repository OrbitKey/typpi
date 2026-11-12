"use client";

import { Check, Lightbulb, Send, Star, Target, X } from "lucide-react";

import type { KanjiOption } from "@/lib/lesson";
import { vowelKana } from "@/lib/lesson";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ */
/* Task card — pinned above the composer                                     */
/* ------------------------------------------------------------------------ */
export function TaskCard({
  goal,
  glossary,
  xp,
  hintCost,
  done,
}: {
  goal: string;
  glossary: { ja: string; en: string }[];
  xp: number;
  hintCost: number;
  done?: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-line-panel bg-white px-4 py-3">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[12px]",
          done ? "bg-success-tint text-success" : "bg-surface-tint text-text-primary"
        )}
      >
        {done ? (
          <Check className="size-4" strokeWidth={3} aria-label="Done" />
        ) : (
          <Target className="size-[22px]" strokeWidth={1.75} aria-hidden />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-[17px] leading-[26px] font-semibold text-text-primary">{goal}</p>
        <p className="text-xs leading-[18px] text-text-secondary">
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
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="flex items-center gap-1 rounded-full bg-surface-tint px-2.5 py-[3px] font-display text-xs leading-4 font-medium tracking-[0.2px] text-text-primary">
          <Star className="size-3.5" strokeWidth={2} aria-hidden />+{xp} XP
        </span>
        {!done && <span className="text-xs leading-[18px] text-text-secondary">−{hintCost} XP per hint</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Romaji input bar                                                          */
/* ------------------------------------------------------------------------ */
export function RomajiBar({
  children,
  helper,
  error,
}: {
  children: React.ReactNode;
  helper: string;
  error?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[46px] min-w-0 flex-1 items-center justify-between gap-3 rounded-2xl border px-[17px] py-[11px] shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]",
        error ? "border-error bg-error-tint" : "border-slate-300 bg-[#fafbfc]"
      )}
    >
      <div className="flex min-w-0 items-center gap-1.5 font-display text-[15px] leading-[22.5px] tracking-[0.375px]">
        {children}
      </div>
      <p className="shrink-0 text-xs leading-[18px] text-text-secondary">{helper}</p>
    </div>
  );
}

export function HintButton({
  used,
  max,
  onClick,
}: {
  used: number;
  max: number;
  onClick: () => void;
}) {
  const exhausted = used >= max;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={exhausted}
      aria-label={`Hint ${Math.min(used + 1, max)} of ${max}`}
      className="flex h-11 shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-[15px] font-display text-sm leading-5 font-semibold text-text-primary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      <Lightbulb className="size-4 text-amber-500" aria-hidden />
      Hint
      <span className="text-xs leading-4 font-normal text-text-secondary">
        {Math.min(used + 1, max)}/{max}
      </span>
    </button>
  );
}

export function ActionButton({
  label,
  enabled,
  onClick,
}: {
  label: string;
  enabled: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      className={cn(
        "flex h-11 w-28 shrink-0 items-center justify-center gap-1.5 rounded-2xl font-display text-sm leading-5 font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        enabled
          ? "bg-brand-primary text-white shadow-cta hover:bg-brand-primary/90"
          : "bg-slate-100 text-slate-400"
      )}
    >
      {label}
      <Send className="size-4" aria-hidden />
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* Kanji picker                                                              */
/* ------------------------------------------------------------------------ */
export function KanjiPicker({
  kana,
  options,
  focused,
  wrong,
  onFocusOption,
  onChoose,
}: {
  kana: string;
  options: KanjiOption[];
  focused: number;
  wrong: number | null;
  onFocusOption: (i: number) => void;
  onChoose: (i: number) => void;
}) {
  return (
    <div className="w-full rounded-2xl border border-line-panel bg-white p-4">
      <div className="flex items-center justify-between pb-3">
        <p id="kanji-title" className="font-display text-sm leading-5 font-medium text-text-primary">
          Choose the correct kanji for the intended meaning.
        </p>
        <span lang="ja" className="font-jp text-sm text-text-secondary">
          {kana}
        </span>
      </div>
      <div role="listbox" aria-labelledby="kanji-title" className="grid grid-cols-3 gap-3">
        {options.map((o, i) => {
          const isFocused = focused === i;
          const isWrong = wrong === i;
          return (
            <button
              key={o.kanji}
              type="button"
              role="option"
              aria-selected={isFocused}
              aria-label={`Option ${i + 1} of ${options.length}, ${o.kanji}, ${o.meaning}`}
              onMouseEnter={() => onFocusOption(i)}
              onClick={() => onChoose(i)}
              className={cn(
                "relative flex h-[92px] flex-col items-start gap-1 rounded-[12px] border px-4 py-2.5 text-left outline-none",
                isWrong
                  ? "border-error bg-error-tint ring-2 ring-error"
                  : isFocused
                    ? "border-brand-primary bg-surface-tint ring-2 ring-brand-primary"
                    : "border-slate-200 bg-white hover:bg-surface-page"
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-[5px] font-display text-xs font-semibold",
                  isFocused && !isWrong
                    ? "bg-brand-primary text-white"
                    : "border border-slate-200 text-text-secondary"
                )}
              >
                {i + 1}
              </span>
              <span
                lang="ja"
                className={cn(
                  "font-jp text-lg leading-7",
                  isWrong ? "text-error line-through decoration-1" : "text-text-primary"
                )}
              >
                {o.kanji}
              </span>
              <span className="font-display text-sm leading-5 text-text-secondary">{o.meaning}</span>
              {isWrong && (
                <X className="absolute top-2.5 right-3 size-4 text-error" strokeWidth={2.5} aria-label="Wrong" />
              )}
            </button>
          );
        })}
      </div>
      <p className="pt-3 font-display text-xs leading-4 text-text-secondary">
        1–3 to choose · Space for next · Enter to confirm · Esc to edit kana
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* On-screen QWERTY keyboard                                                 */
/* ------------------------------------------------------------------------ */
const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "-"],
];
const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

export type KeyState = "next" | "error" | "pressed";

export function Keyboard({
  keyStates,
  onKey,
  guidance,
}: {
  keyStates: Partial<Record<string, KeyState>>;
  onKey: (key: string) => void;
  guidance?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-1.5 rounded-2xl border border-slate-200/70 bg-slate-100/80 p-[9px]">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5">
          {row.map((k) => (
            <Key key={k} label={k} state={keyStates[k]} onPress={() => onKey(k.toLowerCase())} />
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-1.5">
        <ModKey label="Shift" width="w-14" />
        {row3.map((k) => (
          <Key key={k} label={k} state={keyStates[k]} onPress={() => onKey(k.toLowerCase())} />
        ))}
        <ModKey label="⌫" width="w-14" onPress={() => onKey("Backspace")} state={keyStates.Backspace} />
      </div>
      <div className="flex w-full max-w-[500px] justify-center gap-1.5">
        <ModKey label="あ/A" width="w-14" lang="ja" />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => onKey(" ")}
          className="h-10 flex-1 rounded-[12px] border border-slate-200 bg-white font-display text-xs font-medium tracking-[0.6px] text-slate-400"
        >
          Space
        </button>
        <ModKey label="Enter ↵" width="w-16" onPress={() => onKey("Enter")} state={keyStates.Enter} />
      </div>
      {guidance && (
        <p className="flex items-center justify-center gap-1 pt-[5px] font-display text-xs leading-4 font-medium text-text-secondary">
          {guidance}
        </p>
      )}
    </div>
  );
}

function Key({ label, state, onPress }: { label: string; state?: KeyState; onPress: () => void }) {
  const kana = vowelKana[label];
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={label}
      onClick={onPress}
      className={cn(
        "relative flex size-10 flex-col items-center justify-center rounded-[12px] border font-display text-sm leading-5 transition-[box-shadow,background-color] duration-150",
        state === "next" && "border-action-accent/30 bg-white font-bold text-action-accent shadow-[0_0_0_2px_var(--action-accent)]",
        state === "error" && "border-error bg-error-tint font-bold text-error shadow-[0_0_0_2px_var(--error)]",
        state === "pressed" && "border-slate-300 bg-slate-200 font-semibold text-text-primary",
        !state && "border-slate-200 bg-white font-semibold text-text-primary hover:bg-surface-page"
      )}
    >
      {label}
      {kana && (
        <span
          lang="ja"
          className={cn(
            "-mt-1 font-jp text-[8px] leading-[9px]",
            state === "next" ? "text-action-accent" : state === "error" ? "text-error" : "text-text-secondary"
          )}
        >
          {kana}
        </span>
      )}
    </button>
  );
}

function ModKey({
  label,
  width,
  lang,
  onPress,
  state,
}: {
  label: string;
  width: string;
  lang?: string;
  onPress?: () => void;
  state?: KeyState;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      lang={lang}
      onClick={onPress}
      className={cn(
        "flex h-10 items-center justify-center rounded-[12px] font-display text-xs leading-4 font-semibold",
        width,
        state === "next"
          ? "border border-action-accent/30 bg-white text-action-accent shadow-[0_0_0_2px_var(--action-accent)]"
          : "bg-slate-200/90 text-text-secondary"
      )}
    >
      {label}
    </button>
  );
}

/** Small key cap used in helper sentences ("Press [E] …"). */
export function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-[4px] border border-action-accent/30 bg-white px-[7px] py-[2.5px] font-display text-xs leading-4 font-bold text-action-accent">
      {children}
    </kbd>
  );
}
