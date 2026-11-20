"use client";

import { ArrowRight, Bookmark, BookmarkCheck, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { Avatar } from "@/components/chat/avatar";
import { ChatList } from "@/components/lesson/chat-list";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { PlansDialog } from "@/components/plans/plans-dialog";
import { StripeReturn } from "@/components/plans/stripe-return";
import { Stars } from "@/components/ui/stars";
import { characters } from "@/lib/characters";
import { runningLate as lesson } from "@/lib/lesson";
import { cultureTipPhraseId, loadSavedPhraseIds, setPhraseSaved } from "@/lib/saved-phrases";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Option = { base: string; ruby: string; rest: string; correct: boolean };

/* Q1 is designed in Figma; Q2–Q3 are TODO(copy) — confirm with the owner. */
const questions: { question: string; options: Option[] }[] = [
  {
    question: "Which one means \"to be late\"?",
    options: lesson.kanjiOptions.map((o) => ({ base: o.kanji[0], ruby: "おく", rest: o.kanji.slice(1), correct: o.correct })),
  },
  {
    question: "Which one means \"10 minutes\"?",
    options: [
      { base: "10分", ruby: "じゅっぷん", rest: "", correct: true },
      { base: "10時", ruby: "じゅうじ", rest: "", correct: false },
      { base: "10日", ruby: "とおか", rest: "", correct: false },
    ],
  },
  {
    question: "Which one means \"What time?\"",
    options: [
      { base: "何時", ruby: "なんじ", rest: "", correct: true },
      { base: "何分", ruby: "なんぷん", rest: "", correct: false },
      { base: "今日", ruby: "きょう", rest: "", correct: false },
    ],
  },
];

const XP_PER_ANSWER = 5;

/** D-END-01 (quick check) → D-END-02 (after quiz) → D-PAY-01 (paywall) */
export default function LessonCompletePage() {
  const router = useRouter();
  const yuki = characters.yuki;
  const [q, setQ] = useState(0);
  const [selected, setSelected] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [paywall, setPaywall] = useState(false);
  const [translations, setTranslations] = useState(true);

  const current = questions[q];
  const quizXp = score * XP_PER_ANSWER;
  const xp = 60 + (done ? quizXp : 0);

  useEffect(() => {
    let cancelled = false;
    loadSavedPhraseIds().then((ids) => {
      if (!cancelled && ids.includes(cultureTipPhraseId)) setSaved(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSavedPhrase = async () => {
    const next = !saved;
    setSaved(next);
    setSaveError("");
    const ok = await setPhraseSaved(cultureTipPhraseId, next);
    if (!ok) {
      setSaved(!next);
      setSaveError("Couldn't save that phrase.");
    }
  };

  useEffect(() => {
    if (!done && !skipped) return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      await supabase.from("lesson_progress").upsert(
        {
          user_id: user.id,
          lesson_id: "running-late",
          stars: 2,
          xp,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
    });
  }, [done, skipped, xp]);

  const check = () => {
    const nextScore = score + (current.options[selected].correct ? 1 : 0);
    setScore(nextScore);
    if (q + 1 < questions.length) {
      setQ(q + 1);
      setSelected(0);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <AppRail active="chats" />
      <ChatList
        unit={lesson.unit}
        unitTitle={lesson.unitTitle}
        scenarioProgress={lesson.scenarioProgress}
        progressLabel={`${lesson.totalSteps}/${lesson.totalSteps}`}
        done
      />

      <main className="flex h-screen min-w-0 flex-1 flex-col">
        <LessonHeader
          name={yuki.name}
          subtitle="Your manager · Work"
          avatar={yuki.avatar}
          step={lesson.totalSteps}
          totalSteps={lesson.totalSteps}
          xp={xp}
          translations={translations}
          onToggleTranslations={() => setTranslations((v) => !v)}
          done
        />

        <div className="flex flex-1 items-center justify-center overflow-y-auto px-8 py-10">
          <div className="flex w-full max-w-[640px] flex-col gap-4">
            {/* Result card */}
            <section className="flex items-center gap-4 rounded-[20px] border border-line bg-white px-5 py-[18px] shadow-xs">
              <span className="relative">
                <Avatar src={yuki.avatar} alt={yuki.name} size={52} />
                <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-success text-white">
                  <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
                </span>
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-base leading-5 font-semibold text-text-primary">
                    Lesson complete · Running late
                  </h1>
                  <Stars value={2} size={15} />
                </div>
                <p className="flex items-center gap-2 font-display text-[13px] leading-4 text-text-secondary">
                  <span className="font-semibold text-text-primary">+60 XP</span>
                  <span aria-hidden>·</span>
                  <span>3:12</span>
                  <span aria-hidden>·</span>
                  <span>1 mistake</span>
                </p>
              </div>
            </section>

            {!done && !skipped ? (
              /* D-END-01 · Quick check */
              <section aria-labelledby="quiz-q" className="rounded-[20px] border border-line bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs leading-4 font-semibold tracking-[0.6px] text-text-secondary uppercase">
                    Quick check · {q + 1} of {questions.length}
                  </p>
                  <span className="flex gap-1.5" aria-hidden>
                    {questions.map((_, i) => (
                      <span key={i} className={cn("size-2 rounded-full", i <= q ? "bg-brand-primary" : "bg-slate-200")} />
                    ))}
                  </span>
                </div>
                <h2 id="quiz-q" className="pt-5 pb-4 text-[17px] leading-7 font-medium text-text-primary">
                  {current.question}
                </h2>
                <div role="radiogroup" aria-labelledby="quiz-q" className="grid grid-cols-3 gap-3">
                  {current.options.map((o, i) => (
                    <button
                      key={o.base + o.rest}
                      type="button"
                      role="radio"
                      aria-checked={selected === i}
                      onClick={() => setSelected(i)}
                      className={cn(
                        "flex h-24 items-center justify-center rounded-2xl border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selected === i
                          ? "border-[1.5px] border-brand-primary bg-surface-tint"
                          : "border-line bg-white hover:bg-surface-page"
                      )}
                    >
                      <span lang="ja" className="font-jp text-2xl leading-8 text-text-primary">
                        <ruby>
                          {o.base}
                          <rt className="text-xs leading-[14px] text-text-secondary">{o.ruby}</rt>
                        </ruby>
                        {o.rest}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={check}
                  className="mt-5 h-12 w-full rounded-[12px] bg-brand-primary font-display text-sm font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Check
                </button>
                <button
                  type="button"
                  onClick={() => setSkipped(true)}
                  className="mx-auto mt-3 block rounded-sm font-display text-sm font-medium text-text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Skip quiz
                </button>
              </section>
            ) : (
              /* D-END-02 · After quiz */
              <>
                {done && (
                  <section className="flex items-center justify-between rounded-2xl border border-success/25 bg-success-tint px-4 py-3">
                    <p className="flex items-center gap-2.5 font-display text-sm leading-5 font-semibold text-success">
                      <span className="flex size-5 items-center justify-center rounded-full bg-success text-white">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      Quick check · {score}/{questions.length} correct
                    </p>
                    {quizXp > 0 && (
                      <span className="rounded-full border border-success/20 bg-white px-2.5 py-[3px] font-display text-xs leading-4 font-semibold text-success">
                        +{quizXp} XP
                      </span>
                    )}
                  </section>
                )}

                <section className="rounded-[20px] border border-bubble-guide-line bg-bubble-guide/70 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <Avatar src={characters.hana.avatar} alt="Hana" size={36} />
                      <span className="font-display text-xs leading-[14px] font-bold tracking-[0.6px] text-[#6d28d9]">
                        CULTURE TIP
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-pressed={saved}
                      onClick={toggleSavedPhrase}
                      className="flex h-[30px] items-center gap-1.5 rounded-[10px] border border-line bg-white px-3 font-display text-xs font-semibold text-text-primary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {saved ? <BookmarkCheck className="size-3.5" aria-hidden /> : <Bookmark className="size-3.5" aria-hidden />}
                      {saved ? "Saved to Phrases" : "Save to Phrases"}
                    </button>
                  </div>
                  <h2 className="pt-4 text-[17px] leading-6 font-semibold text-text-primary">
                    Prompt reporting – <span lang="ja">ホウレンソウ</span>
                  </h2>
                  <p className="pt-1.5 text-sm leading-[23px] text-text-primary">
                    In Japan, message your manager before your shift starts if you&apos;ll be late. Always give an arrival time.
                  </p>
                  {saveError ? (
                    <p role="alert" className="pt-2 text-sm text-error">
                      {saveError}
                    </p>
                  ) : null}
                </section>

                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaywall(true)}
                    className="flex h-12 w-full items-center justify-center gap-1.5 rounded-[12px] bg-brand-primary font-display text-sm font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Next lesson: Asking for a day off
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                  <Link
                    href="/pathway"
                    className="rounded-sm py-1 font-display text-sm font-medium text-text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Back to pathway
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <StripeReturn />
      <PlansDialog open={paywall} onOpenChange={setPaywall} onNotNow={() => router.push("/pathway?plan=free")} />
    </div>
  );
}
