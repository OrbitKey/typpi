"use client";

import { ArrowRight, Bookmark, BookmarkCheck, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { Avatar } from "@/components/chat/avatar";
import { useLocale } from "@/components/i18n/locale-provider";
import { ChatList } from "@/components/lesson/chat-list";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { PlansDialog } from "@/components/plans/plans-dialog";
import { StripeReturn } from "@/components/plans/stripe-return";
import { Stars } from "@/components/ui/stars";
import { characters } from "@/lib/characters";
import { runningLate as lesson } from "@/lib/lesson";
import { syncBillingPlan } from "@/lib/billing";
import { loadProfile } from "@/lib/profile";
import type { PlanId } from "@/lib/plans";
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
  const { t } = useLocale();
  const yuki = characters.yuki;
  const [q, setQ] = useState(0);
  const [selected, setSelected] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [paywall, setPaywall] = useState(false);
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [translations, setTranslations] = useState(true);

  const current = questions[q];
  const quizXp = score * XP_PER_ANSWER;
  const xp = 60 + (done ? quizXp : 0);

  useEffect(() => {
    let cancelled = false;
    syncBillingPlan()
      .catch(() => null)
      .then(async (synced) => {
        if (cancelled) return;
        if (synced === "individual" || synced === "premium" || synced === "free") {
          setPlan(synced);
          return;
        }
        const profile = await loadProfile();
        if (cancelled) return;
        const saved = profile?.profile.plan;
        setPlan(saved === "individual" || saved === "premium" ? saved : "free");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadSavedPhraseIds().then((ids) => {
      if (!cancelled && ids.includes(cultureTipPhraseId)) setSaved(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const paid = plan === "individual" || plan === "premium";

  const continueAfterLesson = () => {
    if (paid) router.push("/pathway");
    else if (plan === "free") setPaywall(true);
  };

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

  const quizActions = (
    <>
      <button
        type="button"
        onClick={check}
        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-[12px] bg-brand-primary font-display text-sm font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 max-md:order-2"
      >
        Check
        <ArrowRight className="size-4 md:hidden" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setSkipped(true)}
        className="mx-auto block rounded-sm py-1 font-display text-sm font-medium text-text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring max-md:order-1"
      >
        Skip quiz
      </button>
    </>
  );

  const finishActions = (
    <>
      <button
        type="button"
        onClick={continueAfterLesson}
        disabled={plan === null}
        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-[12px] bg-brand-primary font-display text-sm font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {paid ? t("goToPathway") : "Next lesson: Asking for a day off"}
        <ArrowRight className="size-4" aria-hidden />
      </button>
      <Link
        href="/pathway"
        className="rounded-sm py-1 text-center font-display text-sm font-medium text-text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      >
        Back to pathway
      </Link>
    </>
  );

  return (
    <div className="flex min-h-dvh bg-surface-page md:min-h-screen md:bg-white">
      <div className="hidden md:contents">
        <AppRail active="chats" />
      </div>
      <ChatList
        unit={lesson.unit}
        unitTitle={lesson.unitTitle}
        scenarioProgress={lesson.scenarioProgress}
        progressLabel={`${lesson.totalSteps}/${lesson.totalSteps}`}
        done
      />

      <main className="flex h-dvh min-w-0 flex-1 flex-col md:h-screen">
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

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 md:items-center md:justify-center md:px-8 md:py-10">
          <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
            {/* Result card */}
            <section className="flex flex-col items-center gap-3 rounded-[20px] border border-line bg-white px-5 py-6 text-center shadow-xs md:flex-row md:items-center md:gap-4 md:py-[18px] md:text-left">
              <span className="relative">
                <Avatar src={yuki.avatar} alt={yuki.name} size={72} className="md:hidden" />
                <Avatar src={yuki.avatar} alt="" size={52} className="hidden md:inline-flex" />
                <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white bg-success text-white md:size-5">
                  <Check className="size-2.5" strokeWidth={3.5} aria-hidden />
                </span>
              </span>
              <div className="flex flex-col items-center gap-1.5 md:items-start md:gap-1">
                <p className="font-display text-[11px] leading-4 font-semibold tracking-[0.8px] text-brand-secondary uppercase md:hidden">
                  Lesson complete
                </p>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl leading-6 font-semibold text-text-primary md:text-base md:leading-5">
                    <span className="md:hidden">Running late</span>
                    <span className="hidden md:inline">Lesson complete · Running late</span>
                  </h1>
                  <span className="hidden md:inline-flex">
                    <Stars value={2} size={15} />
                  </span>
                </div>
                <span className="md:hidden">
                  <Stars value={2} size={18} />
                </span>
                <p className="flex items-center gap-2 rounded-full bg-surface-tint px-3 py-1 font-display text-[13px] leading-4 text-text-secondary md:rounded-none md:bg-transparent md:px-0 md:py-0">
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
              <section aria-labelledby="quiz-q" className="rounded-[20px] border border-line bg-white p-6 shadow-xs max-md:border-0 max-md:bg-transparent max-md:p-0 max-md:shadow-none">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs leading-4 font-semibold tracking-[0.6px] text-text-secondary uppercase">
                    Quick check · {q + 1} of {questions.length}
                  </p>
                  <span className="flex items-center gap-1.5" aria-hidden>
                    {questions.map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "rounded-full md:size-2",
                          i === q ? "h-1 w-6 bg-brand-primary md:h-2 md:w-2" : "size-1.5",
                          i !== q && (i < q ? "bg-brand-primary" : "bg-slate-200")
                        )}
                      />
                    ))}
                  </span>
                </div>
                <h2 id="quiz-q" className="pt-4 pb-4 text-[22px] leading-7 font-semibold text-text-primary md:pt-5 md:text-[17px] md:font-medium">
                  {current.question}
                </h2>
                <div role="radiogroup" aria-labelledby="quiz-q" className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {current.options.map((o, i) => (
                    <button
                      key={o.base + o.rest}
                      type="button"
                      role="radio"
                      aria-checked={selected === i}
                      onClick={() => setSelected(i)}
                      className={cn(
                        "flex items-center justify-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-24 md:justify-center md:px-0 md:py-0",
                        selected === i
                          ? "border-[1.5px] border-brand-primary bg-surface-tint"
                          : "border-line bg-white hover:bg-surface-page"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 md:hidden",
                          selected === i ? "border-brand-primary" : "border-slate-300"
                        )}
                      >
                        {selected === i && <span className="size-2.5 rounded-full bg-brand-primary" />}
                      </span>
                      <span lang="ja" className="font-jp text-xl leading-8 text-text-primary md:text-2xl">
                        <ruby>
                          {o.base}
                          <rt className="text-xs leading-[14px] text-text-secondary">{o.ruby}</rt>
                        </ruby>
                        {o.rest}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 hidden flex-col gap-3 md:flex">{quizActions}</div>
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
                        <span className="md:hidden">HANA · </span>CULTURE TIP
                      </span>
                    </span>
                    <button
                      type="button"
                      aria-pressed={saved}
                      onClick={toggleSavedPhrase}
                      className="flex h-[30px] items-center gap-1.5 rounded-[10px] border border-line bg-white px-3 font-display text-xs font-semibold text-text-primary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {saved ? <BookmarkCheck className="size-3.5" aria-hidden /> : <Bookmark className="size-3.5" aria-hidden />}
                      <span className="md:hidden">{saved ? "Saved" : "Save phrase"}</span>
                      <span className="hidden md:inline">{saved ? "Saved to Phrases" : "Save to Phrases"}</span>
                    </button>
                  </div>
                  <h2 className="pt-4 text-[17px] leading-6 font-semibold text-text-primary">
                    Prompt reporting – <span lang="ja">ホウレンソウ</span>
                  </h2>
                  <p className="pt-1.5 text-sm leading-[23px] text-text-primary">
                    In Japan, message your manager before your shift starts if you&apos;ll be late. Always give an arrival time.
                  </p>
                  <div className="mt-3 rounded-xl bg-white px-3 py-2.5 md:hidden">
                    <p className="font-display text-xs leading-4 text-text-secondary">Key pattern</p>
                    <p className="pt-0.5 text-[15px] leading-6 font-medium text-text-primary">
                      <span lang="ja">10分ほど遅れます</span> (I&apos;ll be ~10 mins late)
                    </p>
                  </div>
                  {saveError ? (
                    <p role="alert" className="pt-2 text-sm text-error">
                      {saveError}
                    </p>
                  ) : null}
                </section>

                <div className="hidden flex-col items-center gap-3 pt-2 md:flex">{finishActions}</div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          {done || skipped ? finishActions : quizActions}
        </div>
      </main>

      <StripeReturn />
      <PlansDialog
        open={paywall}
        onOpenChange={setPaywall}
        onNotNow={() => router.push("/pathway?plan=free")}
        currentPlan={paid ? plan : "free"}
      />
    </div>
  );
}
