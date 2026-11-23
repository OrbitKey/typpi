"use client";

import { ArrowRight, Check, ChevronUp, Clock, Compass, Lock, Play, Sparkles, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { useLocale } from "@/components/i18n/locale-provider";
import { Avatar } from "@/components/chat/avatar";
import { PlansDialog } from "@/components/plans/plans-dialog";
import { Stars } from "@/components/ui/stars";
import { characters } from "@/lib/characters";
import type { MessageKey } from "@/lib/i18n";
import { isPlayableLesson, lockedSections, workLessons } from "@/lib/pathway";
import { syncBillingPlan } from "@/lib/billing";
import { type PlanId } from "@/lib/plans";
import { loadProfile } from "@/lib/profile";
import { loadLessonProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/**
 * D-PTH-01 · Pathway and D-PTH-02 · Free plan:
 * upsell banner, lessons 4–6 + review need a plan ("Upgrade" opens the plans modal).
 * The saved account plan decides the layout. A `?plan=free` link does not override a paid plan.
 */
export function PathwayView() {
  const [accountPlan, setAccountPlan] = useState<PlanId | null>(null);
  const [firstName, setFirstName] = useState("");
  const [partOfDay, setPartOfDay] = useState<PartOfDay>("pathAfternoon");
  const [travelNotify, setTravelNotify] = useState(false);
  const [notifyError, setNotifyError] = useState("");
  const [xp, setXp] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [starsById, setStarsById] = useState<Record<string, number>>({});
  const [banner, setBanner] = useState(true);
  const [workOpen, setWorkOpen] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const yuki = characters.yuki;
  const { t } = useLocale();
  const titled = (lesson: (typeof workLessons)[number]) => {
    const keys = lessonCopy[lesson.id];
    return keys ? { ...lesson, title: t(keys.title), subtitle: t(keys.subtitle) } : lesson;
  };
  const free = accountPlan === "free";

  const savePlan = (id: PlanId) => {
    setAccountPlan(id);
  };

  const notify = async () => {
    if (travelNotify) return;
    setNotifyError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ travel_notify: true }).eq("id", user.id);
    if (error) {
      setNotifyError(t("onbNotifyError"));
      return;
    }
    setTravelNotify(true);
  };

  useEffect(() => {
    setPartOfDay(partOfDayFor(new Date()));
    let cancelled = false;
    syncBillingPlan()
      .catch(() => null)
      .then(() => Promise.all([loadProfile(), loadLessonProgress()]))
      .then(async ([profile, progress]) => {
      if (cancelled) return;
      const savedPlan = profile?.profile.plan;
      const nextPlan: PlanId = savedPlan === "individual" || savedPlan === "premium" ? savedPlan : "free";
      setAccountPlan(nextPlan);
      const label = profile?.profile.display_name?.trim() || profile?.email.split("@")[0] || "";
      setFirstName(label);
      const byId = Object.fromEntries(progress.map((row) => [row.lesson_id, row.stars]));
      setStarsById(byId);
      setXp(progress.reduce((sum, row) => sum + row.xp, 0));
      let doneCount = 0;
      for (const lesson of workLessons) {
        if (!byId[lesson.id] && byId[lesson.id] !== 0) break;
        doneCount += 1;
      }
      setCompleted(doneCount);
      if (!profile) return;
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("travel_notify")
          .eq("id", profile.userId)
          .maybeSingle();
        if (cancelled || error || !data?.travel_notify) return;
        setTravelNotify(true);
      } catch {
        // The plan is already loaded. A missed notify flag can be saved again from the row.
      }
    })
    .catch(() => {
      if (!cancelled) setAccountPlan("free");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const lessons = workLessons.map(titled);
  const workComplete = completed >= lessons.length;
  const sectionTotal = 1 + lockedSections.length;
  const sectionCurrent = workComplete ? 2 : 1;
  const sectionLabel = workComplete ? t("secHome") : t("pathWork");
  const next = lessons[Math.min(completed, Math.max(lessons.length - 1, 0))];
  const nextLocked = !workComplete && free && !!next.paid && completed < workLessons.length;
  const lessonIndex = Math.min(completed + 1, lessons.length);
  const doneLessons = lessons.slice(0, completed).map((lesson) => ({
    ...lesson,
    stars: starsById[lesson.id] ?? 0,
  }));
  const starsEarned = doneLessons.reduce((sum, lesson) => sum + lesson.stars, 0);

  if (accountPlan === null) {
    return (
      <div className="flex min-h-screen bg-surface-page md:bg-white">
        <AppRail active="pathway" mobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-page md:bg-white">
      <AppRail active="pathway" mobileNav />

      <main className="min-w-0 flex-1 pb-24 md:pb-0">
        {free && banner && (
          <div className="flex h-[45px] items-center gap-3 border-b border-line-panel bg-surface-tint px-6 font-display text-[13px]">
            <div className="mx-auto flex w-full max-w-[880px] items-center gap-3">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-white">
                <Sparkles className="size-3" aria-hidden />
              </span>
              <p className="flex-1 truncate">
                <span className="font-semibold text-text-primary">{t("pathBannerTitle")}</span>
                <span className="text-text-secondary"> · {t("pathBannerBody")}</span>
              </p>
              <button
                type="button"
                onClick={() => setPlansOpen(true)}
                className="rounded-[8px] bg-brand-primary px-3 py-1 text-xs font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("pathSeePlans")}
              </button>
            </div>
            <button
              type="button"
              aria-label={t("pathHideBanner")}
              onClick={() => setBanner(false)}
              className="flex size-7 items-center justify-center rounded-full text-text-secondary outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}

        <div className={cn("mx-auto flex w-full max-w-[880px] flex-col px-4 md:px-6", free ? "gap-5 pt-4 pb-8 md:pb-10" : "gap-5 pt-5 pb-8 md:gap-10 md:pt-9 md:pb-16")}>
          {/* Greeting */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-[22px] leading-7 font-semibold tracking-[-0.3px] text-text-primary md:text-[24px] md:leading-8">
                {t(partOfDay)}{firstName ? `, ${firstName}` : ""}
              </h1>
              <p className="pt-0.5 text-sm leading-5 text-text-secondary">
                {t("pathSectionOf", { current: String(sectionCurrent), total: String(sectionTotal) })} <span aria-hidden className="text-slate-300">•</span> {sectionLabel}
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3.5 py-1.5 font-display text-sm font-semibold text-amber-900">
              <span aria-hidden>⭐</span>
              {xp} XP
            </span>
          </div>

          {/* Up next */}
          <section
            aria-label={t("upNext")}
            className="flex flex-col gap-4 rounded-[20px] border border-line bg-white px-4 py-4 md:flex-row md:items-center md:gap-5 md:px-7 md:py-6"
          >
            <div className="flex min-w-0 items-center gap-3 md:contents">
            <span className="relative">
              <Avatar src={yuki.avatar} alt={yuki.name} size={44} className="md:hidden" />
              <Avatar src={yuki.avatar} alt="" size={56} className="hidden md:inline-flex" />
              {!nextLocked && (
                <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-white bg-success" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs leading-4 font-semibold tracking-[0.6px] text-brand-secondary-text uppercase">{t("upNext")}</p>
              <h2 className="flex items-center gap-1.5 pt-1 font-display text-[17px] leading-6 font-semibold text-text-primary">
                {workComplete ? t("secCompleteTitle", { section: t("pathWork") }) : next.title}
                {nextLocked && <Lock className="size-3.5 text-text-secondary" aria-label={t("pathLocked")} />}
              </h2>
              <p className="flex items-center gap-1.5 pt-0.5 text-[13px] leading-5 text-text-secondary">
                {t("pathWork")} <span aria-hidden className="text-slate-300">•</span>{" "}
                {workComplete
                  ? t("pathOfLessons", { done: String(completed), total: String(workLessons.length) })
                  : t("pathLessonOf", { current: String(lessonIndex), total: String(workLessons.length) })}
                {!workComplete && typeof next.minutes === "number" && (
                  <>
                    <span aria-hidden className="text-slate-300">•</span>
                    <Clock className="size-3.5" aria-hidden /> {t("pathMinutes", { count: String(next.minutes) })}
                  </>
                )}
              </p>
            </div>
            </div>
            {workComplete ? (
              <Link
                href="/pathway/complete"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary px-6 font-display text-[15px] font-medium text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-11 md:w-auto"
              >
                {t("continue")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : nextLocked ? (
              <button
                type="button"
                onClick={() => setPlansOpen(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary px-5 font-display text-sm font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-11 md:w-auto"
              >
                {t("pathUnlockAll")}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : isPlayableLesson(next.id) ? (
              <Link
                href="/lesson"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary px-6 font-display text-[15px] font-medium text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-11 md:w-auto"
              >
                {t("continue")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex h-12 w-full cursor-default items-center justify-center rounded-[12px] bg-surface-tint px-6 font-display text-[15px] font-medium text-text-secondary md:h-11 md:w-auto"
              >
                {t("pathComingSoon")}
              </button>
            )}
          </section>

          {/* Your path */}
          <section aria-labelledby="your-path" className="flex flex-col gap-4">
            <h2 id="your-path" className="font-display text-xl leading-7 font-semibold text-text-primary">
              {t("yourPath")}
            </h2>

            {/* Section 1: Work */}
            <article className="overflow-hidden rounded-[20px] border border-line bg-white">
              <header className={cn("flex items-center gap-3 px-4 md:gap-4 md:px-6", free ? "py-4" : "py-4 md:py-6")}>
                <Avatar src={yuki.avatar} alt={yuki.name} size={free ? 40 : 48} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2">
                    <span className="font-display text-[17px] leading-6 font-semibold text-text-primary">{t("pathWork")}</span>
                    {!workComplete && (
                      <span className="rounded-full bg-brand-primary px-2 py-0.5 font-display text-[11px] leading-4 font-semibold tracking-[0.3px] text-white">
                        {t("current")}
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[13px] leading-5 text-text-secondary">{t("pathRoleAfter", { name: yuki.name, role: t("secManager") })}</p>
                </div>
                <div className={cn("flex items-center gap-2", !free && "flex-col items-end gap-1")}>
                  {!free && (
                    <span className="font-display text-xs font-semibold text-text-primary">
                      <span className="md:hidden">{completed}/{workLessons.length}</span>
                      <span className="hidden md:inline">{t("pathOfLessons", { done: String(completed), total: String(workLessons.length) })}</span>
                    </span>
                  )}
                  <span
                    role="progressbar"
                    aria-label={t("pathWorkProgress")}
                    aria-valuemin={0}
                    aria-valuemax={workLessons.length}
                    aria-valuenow={completed}
                    className="block h-1 w-10 overflow-hidden rounded-full bg-surface-tint md:w-24"
                  >
                    <span
                      className="block h-full rounded-full bg-brand-primary"
                      style={{ width: `${(completed / workLessons.length) * 100}%` }}
                    />
                  </span>
                  {free && (
                    <span className="font-display text-[13px] text-text-secondary">
                      {t("pathOfTotal", { done: String(completed), total: String(workLessons.length) })}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  aria-expanded={workOpen}
                  aria-label={workOpen ? t("pathCollapse") : t("pathExpand")}
                  onClick={() => setWorkOpen((v) => !v)}
                  className="flex size-8 items-center justify-center rounded-full text-text-secondary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronUp className={cn("size-4 transition-transform", !workOpen && "rotate-180")} aria-hidden />
                </button>
              </header>

              {workOpen &&
                (free ? (
                  <ol className="divide-y divide-line border-t border-line bg-surface-page/60">
                    {completed > 0 && (
                    <li>
                      <div className="flex items-center gap-4 px-6 py-3">
                        <DoneDot />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[13px] font-semibold text-text-primary">
                            {completed === 1 ? t("pathOneDone", { count: String(completed) }) : t("pathManyDone", { count: String(completed) })}
                          </p>
                          <p className="truncate text-[13px] text-text-secondary">
                            {doneLessons.map((l) => l.title).join(" · ")}
                          </p>
                        </div>
                        <span className="font-display text-[13px] font-semibold text-brand-secondary-text">
                          {starsEarned}/{completed * 3} ★
                        </span>
                        <button
                          type="button"
                          aria-expanded={showDone}
                          onClick={() => setShowDone((v) => !v)}
                          className="rounded-[6px] border border-line bg-white px-2 py-0.5 font-display text-xs font-medium text-text-primary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {showDone ? t("hide") : t("show")}
                        </button>
                      </div>
                      {showDone && (
                        <ul className="flex flex-col gap-1 px-6 pb-3 pl-[68px]">
                          {doneLessons.map((l) => (
                            <li key={l.id} className="flex items-center justify-between text-[13px] text-text-secondary">
                              {isPlayableLesson(l.id) ? (
                                <Link href="/lesson" className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring">
                                  {l.title}
                                </Link>
                              ) : (
                                <span>{l.title}</span>
                              )}
                              <Stars value={l.stars} size={12} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                    )}
                    {lessons.slice(completed).map((l) =>
                      l.paid ? (
                        <CompactRow key={l.id} title={l.title} subtitle={l.subtitle} onUpgrade={() => setPlansOpen(true)} />
                      ) : (
                        <UpcomingRow key={l.id} id={l.id} title={l.title} subtitle={l.subtitle} current={l.id === next.id} />
                      )
                    )}
                    <CompactRow title={t("pathSectionReview")} subtitle={t("pathReviewSub")} review onUpgrade={() => setPlansOpen(true)} />
                  </ol>
                ) : (
                  <ol className="flex flex-col gap-1 border-t border-line px-4 py-4">
                    {lessons.map((l, i) => (
                      <LessonRow
                        key={l.title}
                        index={i + 1}
                        lesson={{ ...l, stars: starsById[l.id] }}
                        status={i < completed ? "done" : i === completed ? "current" : "locked"}
                      />
                    ))}
                    <li className="flex items-center gap-4 rounded-2xl bg-surface-page px-4 py-3 md:bg-transparent" aria-label={t("pathReviewLocked")}>
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-action-accent/10 text-brand-secondary-text">
                        <Trophy className="size-3.5" aria-hidden />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[15px] leading-5 text-text-primary">{t("pathSectionReview")}</span>
                        <span className="block font-display text-xs font-medium text-text-primary">
                          {t("pathReviewSub")}
                        </span>
                      </span>
                      <Lock className="size-4 text-text-primary" aria-hidden />
                    </li>
                  </ol>
                ))}
            </article>

            {lockedSections.map((s) => {
              const c = characters[s.character];
              return (
                <article
                  key={s.id}
                  id={`section-${s.id}`}
                  aria-label={`${t(sectionTitle[s.id])}, ${t("pathLocked")}`}
                  className={cn("flex items-center gap-3 rounded-[20px] border border-line bg-white px-4 md:gap-4 md:px-6", free ? "py-3" : "py-3 md:py-4")}
                >
                  <Avatar src={c.avatar} alt={c.name} size={free ? 36 : 44} grayscale />
                  <div className="flex-1">
                    <p className={cn("font-display font-semibold text-text-primary", free ? "text-[13px]" : "text-[17px]")}>
                      {t(sectionTitle[s.id])}
                    </p>
                    <p className="truncate text-[13px] text-text-secondary">
                      {t("pathRoleAfter", { name: c.name, role: t(sectionRole[s.id]) })}
                    </p>
                  </div>
                  <span className="flex items-center gap-2 font-display text-[13px] text-text-secondary">
                    {s.id === "home" ? t("secFinishWork") : t("pathLocked")}
                    <Lock className="size-4" aria-hidden />
                  </span>
                </article>
              );
            })}

            <div className="flex items-center gap-3 rounded-[20px] border border-line bg-white px-4 py-3 md:bg-surface-page md:px-6 md:py-4">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-surface-tint text-text-primary">
                <Compass className="size-4" aria-hidden />
              </span>
              <p className="flex-1 font-display text-[13px] text-text-secondary">
                <span className="font-semibold text-text-primary">{t("onbTravelSoon")}</span>
                {notifyError ? <span className="text-error"> · {notifyError}</span> : null}
              </p>
              {travelNotify ? (
                <span className="font-display text-[13px] font-semibold text-text-primary">{t("onbNotifySaved")}</span>
              ) : (
                <button
                  type="button"
                  onClick={notify}
                  className="rounded-full border border-line bg-white px-3 py-1.5 font-display text-[13px] font-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring md:rounded-sm md:border-0 md:bg-transparent md:px-0 md:py-0 md:hover:underline"
                >
                  {t("onbNotifyMe")}
                </button>
              )}
            </div>
          </section>
        </div>
      </main>

      <PlansDialog
        open={plansOpen}
        onOpenChange={setPlansOpen}
        onNotNow={() => {}}
        onPlanSaved={savePlan}
        currentPlan={accountPlan}
        title={t("pathUnlockEvery")}
      />
    </div>
  );
}

type PartOfDay = "pathMorning" | "pathAfternoon" | "pathEvening";

const lessonCopy: Record<string, { title: MessageKey; subtitle: MessageKey }> = {
  "running-late": { title: "lesRunning", subtitle: "lesRunningSub" },
  "day-off": { title: "lesDayOff", subtitle: "lesDayOffSub" },
  "changing-shift": { title: "lesShift", subtitle: "lesShiftSub" },
  "calling-in-sick": { title: "lesSick", subtitle: "lesSickSub" },
  "asking-a-question": { title: "lesQuestion", subtitle: "lesQuestionSub" },
  "thanking-manager": { title: "lesThanks", subtitle: "lesThanksSub" },
};

const sectionTitle: Record<string, MessageKey> = {
  home: "secHome",
  health: "secHealth",
  coworkers: "secCoworkers",
  city: "secCity",
};

const sectionRole: Record<string, MessageKey> = {
  home: "secLandlord",
  health: "secDoctor",
  coworkers: "secColleague",
  city: "secClerk",
};

function partOfDayFor(now: Date): PartOfDay {
  const hour = now.getHours();
  if (hour < 12) return "pathMorning";
  if (hour < 18) return "pathAfternoon";
  return "pathEvening";
}

function DoneDot() {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-tint text-success">
      <Check className="size-3.5" strokeWidth={3} aria-hidden />
    </span>
  );
}

/** D-PTH-01 lesson row */
function LessonRow({
  index,
  lesson,
  status,
}: {
  index: number;
  lesson: { id?: string; title: string; subtitle: string; stars?: number };
  status: "done" | "current" | "locked";
}) {
  const { t } = useLocale();
  const replay = status === "done" && !!lesson.id && isPlayableLesson(lesson.id);
  const playable = status === "current" && !!lesson.id && isPlayableLesson(lesson.id);
  const body = (
    <>
      {status === "done" ? (
        <DoneDot />
      ) : playable ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
          <Play className="size-3 fill-white" aria-hidden />
        </span>
      ) : status === "current" ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-tint text-text-secondary">
          <Clock className="size-3.5" aria-hidden />
        </span>
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-tint text-text-primary">
          <Lock className="size-3.5" aria-hidden />
        </span>
      )}
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] leading-5 text-text-primary">{lesson.title}</span>
        <span className={cn("block truncate font-display text-xs leading-5 font-medium text-text-primary", status === "locked" && "text-text-secondary md:hidden")}>
          {status === "done" ? t("pathCompletedSub", { subtitle: lesson.subtitle }) : lesson.subtitle}
        </span>
      </span>
      {status === "done" && lesson.stars !== undefined && <Stars value={lesson.stars} size={13} />}
      {status === "current" && !playable && (
        <span className="font-display text-xs font-semibold text-text-secondary">{t("pathComingSoon")}</span>
      )}
      {status === "locked" && <span className="font-display text-xs font-semibold text-text-primary">{t("pathLessonIndex", { index: String(index) })}</span>}
    </>
  );

  const base = "flex w-full items-center gap-4 rounded-2xl px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <li>
      {playable || replay ? (
        <Link href="/lesson" className={cn(base, playable ? "border border-draft-line bg-surface-tint" : "hover:bg-surface-page")}>
          {body}
        </Link>
      ) : (
        <div className={base} aria-label={status === "locked" ? `${lesson.title}, ${t("pathLocked")}` : undefined}>
          {body}
        </div>
      )}
    </li>
  );
}

/** Next free lesson. The screen for it is not built yet, so there is no upgrade wall. */
function UpcomingRow({ id, title, subtitle, current }: { id: string; title: string; subtitle: string; current: boolean }) {
  const { t } = useLocale();
  const playable = current && isPlayableLesson(id);
  const waiting = current && !playable;
  const row = (
    <>
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          waiting ? "bg-surface-tint text-text-secondary" : "bg-brand-primary text-white"
        )}
      >
        {waiting ? <Clock className="size-3.5" aria-hidden /> : <Play className="size-3 fill-white" aria-hidden />}
      </span>
      <span className="flex-1 text-left">
        <span className="block font-display text-[13px] font-medium text-text-primary">{title}</span>
        <span className="block text-[13px] text-text-secondary">{subtitle}</span>
      </span>
      <span className="font-display text-xs font-semibold text-text-secondary">
        {playable ? t("upNext") : waiting ? t("pathComingSoon") : t("later")}
      </span>
    </>
  );
  const className = "flex w-full items-center gap-4 px-6 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <li>
      {playable ? (
        <Link href="/lesson" className={className}>
          {row}
        </Link>
      ) : (
        <div className={className}>{row}</div>
      )}
    </li>
  );
}

/** D-PTH-02 compact row (locked by plan) */
function CompactRow({
  title,
  subtitle,
  review,
  onUpgrade,
}: {
  title: string;
  subtitle: string;
  review?: boolean;
  onUpgrade: () => void;
}) {
  const { t } = useLocale();
  return (
    <li className="flex items-center gap-4 px-6 py-3">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          review ? "bg-action-accent/10 text-brand-secondary-text" : "bg-slate-100 text-text-secondary"
        )}
      >
        {review ? <Trophy className="size-3.5" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
      </span>
      <span className="flex-1">
        <span className="block font-display text-[13px] font-medium text-text-primary">{title}</span>
        <span className="block text-[13px] text-text-secondary">{subtitle}</span>
      </span>
      <button
        type="button"
        onClick={onUpgrade}
        aria-label={t("pathLockedUpgrade", { title })}
        className="rounded-full border border-brand-secondary-text bg-white px-2.5 py-0.5 font-display text-[13px] font-semibold text-brand-secondary-text outline-none hover:bg-error-tint focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("upgrade")}
      </button>
    </li>
  );
}
