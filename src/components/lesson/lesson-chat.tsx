"use client";

import { ArrowRight, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { ChatList } from "@/components/lesson/chat-list";
import {
  ActionButton,
  HintButton,
  KanjiPicker,
  Keyboard,
  KeyCap,
  RomajiBar,
  TaskCard,
  type KeyState,
} from "@/components/lesson/composer";
import { LessonHeader } from "@/components/lesson/lesson-header";
import {
  CharacterMessage,
  CultureTip,
  TaskBubble,
  TypingMessage,
  DraftBubble,
  HintMessage,
  SentBubble,
  Timestamp,
} from "@/components/lesson/messages";
import { characters } from "@/lib/characters";
import { toKana, type Lesson } from "@/lib/lesson";
import { cn } from "@/lib/utils";

type Phase = "typing" | "kanji" | "sent";

type TypingError = {
  pressed: string;
  expected: string;
  /** e.g. "り" for r + i */
  wrongKana?: string;
  rightKana: string;
  consonant: string;
};

type Hint = { id: number; level: number; phase: Phase; syllable: number };

/**
 * D-LSN-01…06 — chat lesson as one interactive state machine:
 * typing (romaji → kana) → kanji picker → sent, with the wrong-key,
 * wrong-kanji and hint branches.
 */
export function LessonChat({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const yuki = characters.yuki;
  const hana = characters.hana;
  const { syllables, task } = lesson;

  const [phase, setPhase] = useState<Phase>("typing");
  const [syl, setSyl] = useState(0); // current syllable index
  const [chr, setChr] = useState(0); // chars typed inside the current syllable
  const [error, setError] = useState<TypingError | null>(null);
  const [kanjiFocus, setKanjiFocus] = useState(0);
  const [kanjiWrong, setKanjiWrong] = useState<number | null>(null);
  const [hints, setHints] = useState<Hint[]>([]);
  const [translations, setTranslations] = useState(true);
  const [pressed, setPressed] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  const typingDone = syl >= syllables.length;
  const current = syllables[syl];
  const expectedKey = !typingDone ? current.romaji[chr] : undefined;
  const earnedXp = task.xp - hints.length * task.hintCost;

  /* ---------------------------------------------------------------- input */

  const flash = (key: string) => {
    setPressed(key.toUpperCase());
    window.setTimeout(() => setPressed(null), 140);
  };

  const typeLetter = useCallback(
    (key: string) => {
      if (phase !== "typing" || typingDone || error) return;
      const s = syllables[syl];
      const expected = s.romaji[chr];
      if (key === expected) {
        if (chr + 1 >= s.romaji.length) {
          const next = syl + 1;
          setChr(0);
          setSyl(next);
          if (next >= syllables.length) {
            setPhase("kanji");
            setKanjiFocus(0);
          }
        } else {
          setChr((c) => c + 1);
        }
      } else {
        const typed = s.romaji.slice(0, chr);
        setError({
          pressed: key,
          expected,
          wrongKana: toKana(typed + key),
          rightKana: s.kana,
          consonant: typed,
        });
      }
    },
    [phase, typingDone, error, syllables, syl, chr]
  );

  const backspace = useCallback(() => {
    if (phase !== "typing") return;
    if (error) return setError(null);
    if (chr > 0) return setChr((c) => c - 1);
    if (syl > 0) {
      const prev = syllables[syl - 1];
      setSyl(syl - 1);
      setChr(prev.romaji.length - 1);
    }
  }, [phase, error, chr, syl, syllables]);

  const addHint = useCallback(() => {
    if (phase === "sent" || hints.length >= task.maxHints) return;
    setHints((h) => [...h, { id: Date.now(), level: h.length + 1, phase, syllable: syl }]);
  }, [phase, hints.length, task.maxHints, syl]);

  const chooseKanji = useCallback(
    (i: number) => {
      setKanjiFocus(i);
      if (lesson.kanjiOptions[i].correct) {
        setKanjiWrong(null);
        setPhase("sent");
      } else {
        setKanjiWrong(i);
      }
    },
    [lesson.kanjiOptions]
  );

  const retryKanji = () => {
    setKanjiWrong(null);
    setKanjiFocus(lesson.kanjiOptions.findIndex((o) => o.correct));
  };

  const onKey = useCallback(
    (key: string) => {
      flash(key === "Backspace" ? "Backspace" : key === "Enter" ? "Enter" : key);
      if (phase === "typing") {
        if (key === "Backspace") return backspace();
        if (typingDone && (key === "Enter" || key === " ")) {
          setPhase("kanji");
          return;
        }
        if (/^[a-z-]$/.test(key)) typeLetter(key);
      } else if (phase === "kanji") {
        const n = lesson.kanjiOptions.length;
        if (/^[1-9]$/.test(key) && Number(key) <= n) {
          setKanjiWrong(null);
          setKanjiFocus(Number(key) - 1);
        } else if (key === " " || key === "ArrowRight" || key === "ArrowDown") {
          setKanjiWrong(null);
          setKanjiFocus((f) => (f + 1) % n);
        } else if (key === "ArrowLeft" || key === "ArrowUp") {
          setKanjiWrong(null);
          setKanjiFocus((f) => (f - 1 + n) % n);
        } else if (key === "Enter") {
          if (kanjiWrong !== null) retryKanji();
          else chooseKanji(kanjiFocus);
        } else if (key === "Escape") {
          setKanjiWrong(null);
          setPhase("typing");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, typingDone, backspace, typeLetter, kanjiFocus, kanjiWrong, chooseKanji, lesson.kanjiOptions]
  );

  // Physical keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Tab" && phase !== "sent") {
        e.preventDefault();
        addHint();
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (
        /^[a-z1-9 -]$/.test(key) ||
        ["Backspace", "Enter", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(key)
      ) {
        // Let buttons handle their own Enter/Space when focused.
        if ((key === "Enter" || key === " ") && target.closest("button")) return;
        e.preventDefault();
        onKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey, addHint, phase]);

  // Yuki replies shortly after the message is sent.
  useEffect(() => {
    if (phase !== "sent") return;
    const t = window.setTimeout(() => setShowReply(true), 1500);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, [phase, hints.length, showReply, error, kanjiWrong]);

  /* --------------------------------------------------------------- render */

  const typedKana = syllables.slice(0, syl).map((s) => s.kana).join("");
  const remainingKana = syllables.slice(syl).map((s) => s.kana);

  const keyStates = useMemo(() => {
    const states: Partial<Record<string, KeyState>> = {};
    if (phase === "typing") {
      if (error) {
        states[error.pressed.toUpperCase()] = "error";
        states[error.expected.toUpperCase()] = "next";
      } else if (expectedKey) {
        states[expectedKey.toUpperCase()] = "next";
      }
    }
    if (phase === "kanji") states.Enter = "next";
    if (pressed && !states[pressed]) states[pressed] = "pressed";
    return states;
  }, [phase, error, expectedKey, pressed]);

  const selectedKanji = lesson.kanjiOptions[kanjiFocus];
  const wrongOption = kanjiWrong !== null ? lesson.kanjiOptions[kanjiWrong] : null;
  const correctKanji = lesson.kanjiOptions.find((o) => o.correct)!.kanji;
  const completedSteps = phase === "sent" ? lesson.step + 1 : lesson.step;

  return (
    <div className="flex min-h-dvh bg-white md:min-h-screen">
      <div className="hidden md:contents">
        <AppRail active="chats" />
      </div>
      <ChatList
        unit={lesson.unit}
        unitTitle={lesson.unitTitle}
        scenarioProgress={lesson.scenarioProgress}
        progressLabel={phase === "sent" ? `${completedSteps}/${lesson.totalSteps}` : undefined}
      />

      <main className="flex h-dvh min-w-0 flex-1 flex-col md:h-screen">
        <LessonHeader
          name={yuki.name}
          subtitle="Your manager · Work"
          avatar={yuki.avatar}
          step={completedSteps}
          totalSteps={lesson.totalSteps}
          xp={phase === "sent" ? lesson.xp + earnedXp : lesson.xp}
          translations={translations}
          onToggleTranslations={() => setTranslations((v) => !v)}
        />

        {/* Message stream */}
        <div ref={streamRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-8 md:py-6">
          <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col justify-end gap-4 md:gap-6">
            <div className="hidden md:flex">
              <Timestamp>{lesson.timestamp}</Timestamp>
            </div>

            <CharacterMessage
              avatar={yuki.avatar}
              name={yuki.name}
              lines={lesson.incoming.lines}
              romaji={lesson.incoming.romaji}
              translation={lesson.incoming.translation}
              showTranslation={translations}
            />

            <TaskBubble
              avatar={hana.avatar}
              goal={task.goal}
              glossary={task.glossary}
              xp={earnedXp}
              done={phase === "sent"}
            />

            {phase === "sent" ? (
              <SentBubble
                text={`${lesson.prefix}${correctKanji}${lesson.suffix}`}
                sentAt={lesson.sentAt}
                stamp={lesson.feedback.stamp}
                xp={earnedXp}
                praise={lesson.feedback.message}
              />
            ) : (
              <DraftBubble
                error={!!error || kanjiWrong !== null}
                errorTip={
                  error
                    ? error.wrongKana && error.consonant
                      ? `${error.wrongKana} → ${error.rightKana}. After ${error.consonant.toUpperCase()}, press ${error.expected.toUpperCase()} – not ${error.pressed.toUpperCase()}.`
                      : `${error.rightKana}: press ${error.expected.toUpperCase()} – not ${error.pressed.toUpperCase()}.`
                    : wrongOption?.why
                }
                onRetry={error ? () => setError(null) : wrongOption ? retryKanji : undefined}
              >
                <span lang="ja">{lesson.prefix}</span>
                {phase === "kanji" ? (
                  wrongOption ? (
                    <span lang="ja" className="ml-1 underline decoration-error decoration-2 underline-offset-[6px]">
                      {wrongOption.kanji}
                    </span>
                  ) : (
                    <span lang="ja" className="ml-1 underline decoration-text-primary decoration-1 underline-offset-[6px]">
                      {lesson.kana}
                    </span>
                  )
                ) : (
                  <>
                    <span lang="ja">{typedKana}</span>
                    {error?.wrongKana && (
                      <span lang="ja" className="text-error underline decoration-error decoration-2 underline-offset-[6px]">
                        {error.wrongKana}
                      </span>
                    )}
                    <span aria-hidden className="mx-px inline-block h-5 w-0.5 translate-y-[3px] animate-pulse bg-action-accent" />
                    {remainingKana.map((k, i) => (
                      <span
                        key={i}
                        lang="ja"
                        className={cn(
                          "text-slate-400",
                          i === 0 && !error && "underline decoration-action-accent decoration-2 underline-offset-[6px]"
                        )}
                      >
                        {k}
                      </span>
                    ))}
                  </>
                )}
                <span lang="ja" className="text-slate-400">
                  {lesson.suffix}
                </span>
              </DraftBubble>
            )}

            {phase !== "sent" &&
              hints.map((h) => (
                <HintMessage
                  key={h.id}
                  avatar={hana.avatar}
                  index={h.level}
                  max={task.maxHints}
                  cost={task.hintCost}
                  steps={h.phase === "typing" && h.level === 1 ? syllables.map((s) => s.romaji) : undefined}
                  currentStep={h.syllable}
                >
                  <HintText hint={h} lesson={lesson} />
                </HintMessage>
              ))}

            {phase === "sent" && !showReply && <TypingMessage avatar={yuki.avatar} name={yuki.name} />}

            {phase === "sent" && showReply && (
              <>
                <CharacterMessage
                  avatar={yuki.avatar}
                  name={yuki.name}
                  lines={lesson.reply.lines}
                  romaji={lesson.reply.romaji}
                  translation={lesson.reply.translation}
                  showTranslation={translations}
                  withChips={false}
                />
                <div className="hidden md:block">
                  <CultureTip>{lesson.cultureTip}</CultureTip>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom dock */}
        <footer className="relative border-t border-slate-200 bg-white px-3 pt-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0px_-4px_15px_-3px_rgba(0,0,0,0.06)] md:px-8 md:pt-[17px] md:pb-4">
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-3">
            <TaskCard
              className="hidden md:flex"
              goal={task.goal}
              glossary={task.glossary}
              xp={earnedXp}
              hintCost={task.hintCost}
              done={phase === "sent"}
            />

            {phase === "sent" ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push("/lesson/complete")}
                  className="flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-brand-primary font-display text-sm font-semibold text-white shadow-cta outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-11 md:w-28"
                >
                  Next
                  <ArrowRight className="size-4" aria-hidden />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <RomajiBar
                    error={!!error || kanjiWrong !== null}
                    extra={
                      <>
                        <HintButton
                          used={hints.length}
                          max={task.maxHints}
                          onClick={addHint}
                          className="h-auto gap-1 border-0 bg-transparent px-1 py-0 text-[13px] shadow-none hover:bg-transparent"
                        />
                        <button
                          type="button"
                          aria-label="Enter"
                          onClick={() => onKey("Enter")}
                          className="flex size-7 items-center justify-center rounded-full text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ChevronUp className="size-4" aria-hidden />
                        </button>
                      </>
                    }
                    helper={
                      phase === "kanji"
                        ? "Pick a kanji to send · Esc to edit kana"
                        : error
                          ? "Backspace to fix · Tab for hint"
                          : typingDone
                            ? "Enter to pick a kanji · Backspace to edit"
                            : "Finish typing to send · Tab for hint"
                    }
                  >
                    {phase === "kanji" ? (
                      <span lang="ja" className="font-jp text-[15px] font-medium text-text-primary">
                        {lesson.kana}
                      </span>
                    ) : (
                      <RomajiSteps syllables={syllables} syl={syl} chr={chr} error={error} />
                    )}
                  </RomajiBar>
                  <HintButton used={hints.length} max={task.maxHints} onClick={addHint} className="hidden md:flex" />
                  <ActionButton
                    label="Send"
                    enabled={phase === "kanji" && kanjiWrong === null}
                    onClick={() => chooseKanji(kanjiFocus)}
                    className="hidden md:flex"
                  />
                </div>

                <p aria-live="assertive" className="sr-only">
                  {error ? "Wrong key." : wrongOption ? wrongOption.why : ""}
                  {phase === "kanji" && !wrongOption
                    ? `Option ${kanjiFocus + 1} of ${lesson.kanjiOptions.length}, ${selectedKanji.kanji}, ${selectedKanji.meaning}`
                    : ""}
                </p>

                {phase === "kanji" && (
                  <KanjiPicker
                    kana={lesson.kana}
                    options={lesson.kanjiOptions}
                    focused={kanjiFocus}
                    wrong={kanjiWrong}
                    onFocusOption={(i) => kanjiWrong === null && setKanjiFocus(i)}
                    onChoose={chooseKanji}
                  />
                )}

                <p className="text-center font-display text-[13px] leading-4 font-medium text-text-secondary md:hidden">
                  {phase === "kanji"
                    ? "Press Enter"
                    : error
                      ? `Press ${error.expected.toUpperCase()}`
                      : expectedKey
                        ? `Press ${expectedKey.toUpperCase()}`
                        : "Press Enter"}
                </p>
                <Keyboard
                  keyStates={keyStates}
                  onKey={onKey}
                  guidance={
                    phase !== "typing" ? undefined : error ? (
                      <>
                        Press <KeyCap>⌫</KeyCap> to fix, then <KeyCap>{error.expected.toUpperCase()}</KeyCap>
                      </>
                    ) : expectedKey ? (
                      <>
                        Press <KeyCap>{expectedKey.toUpperCase()}</KeyCap> on your keyboard or tap above
                      </>
                    ) : (
                      <>
                        Press <KeyCap>Enter</KeyCap> to choose the kanji
                      </>
                    )
                  }
                />
              </>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

/** "o · ku · [r]e · ma · su" with done / current / upcoming styles. */
function RomajiSteps({
  syllables,
  syl,
  chr,
  error,
}: {
  syllables: Lesson["syllables"];
  syl: number;
  chr: number;
  error: TypingError | null;
}) {
  return (
    <>
      {syllables.map((s, i) => {
        const dot = i > 0 && <span className="text-slate-400">·</span>;
        if (i < syl)
          return (
            <Fragment key={i}>
              {dot}
              <span className="font-bold text-text-primary">{s.romaji}</span>
            </Fragment>
          );
        if (i === syl) {
          const typed = s.romaji.slice(0, chr);
          if (error)
            return (
              <Fragment key={i}>
                {dot}
                <span className="font-bold text-error">{typed + error.pressed}</span>
                <span className="font-semibold text-text-secondary">→ {s.romaji}</span>
              </Fragment>
            );
          return (
            <Fragment key={i}>
              {dot}
              {typed ? (
                <span className="rounded-[4px] bg-action-accent/10 px-1 font-bold text-action-accent shadow-[0_0_0_1px_rgba(230,107,80,0.3)]">
                  {typed}
                </span>
              ) : null}
              <span className="text-slate-400">{s.romaji.slice(chr)}</span>
            </Fragment>
          );
        }
        return (
          <Fragment key={i}>
            {dot}
            <span className="text-slate-400">{s.romaji}</span>
          </Fragment>
        );
      })}
    </>
  );
}

/** Hint ladder: 1 = next sound, 2 = reading of the whole word, 3 = full answer. */
function HintText({ hint, lesson }: { hint: Hint; lesson: Lesson }) {
  const correct = lesson.kanjiOptions.find((o) => o.correct)!;
  if (hint.phase === "kanji") {
    const others = lesson.kanjiOptions.filter((o) => !o.correct);
    return (
      <>
        <span lang="ja">{correct.kanji}</span> = {correct.meaning}.{" "}
        {others.map((o, i) => (
          <span key={o.kanji}>
            {i > 0 && ", "}
            <span lang="ja">{o.kanji}</span> = {o.meaning}
          </span>
        ))}
        .
      </>
    );
  }
  if (hint.level === 1) {
    const typed = lesson.syllables.slice(0, hint.syllable).map((s) => s.kana).join("");
    const next = lesson.syllables[hint.syllable];
    if (!next) return <>Press Enter, then pick the kanji that means “to be late”.</>;
    const keys = next.romaji.toUpperCase().split("");
    return (
      <>
        {typed ? (
          <>
            You typed <span lang="ja">{typed}</span>.{" "}
          </>
        ) : null}
        The next sound is <span lang="ja">{next.kana}</span> — press {keys.join(", then ")}.
      </>
    );
  }
  if (hint.level === 2) {
    return (
      <>
        The whole word is <span lang="ja">{lesson.kana}</span> ·{" "}
        {lesson.syllables.map((s) => s.romaji).join("")}.
      </>
    );
  }
  return (
    <>
      Full answer: <span lang="ja">{lesson.prefix + correct.kanji + lesson.suffix}</span>
    </>
  );
}
