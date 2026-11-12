"use client";

import { ArrowRight, Check, ChevronUp, Clock, Compass, Lock, Play, Sparkles, Trophy, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { Avatar } from "@/components/chat/avatar";
import { PlansDialog } from "@/components/plans/plans-dialog";
import { Stars } from "@/components/ui/stars";
import { characters } from "@/lib/characters";
import { lockedSections, workLessons } from "@/lib/pathway";
import { cn } from "@/lib/utils";

/**
 * D-PTH-01 · Pathway and D-PTH-02 · Pathway after "Not now" (Free plan):
 * upsell banner, lessons 4–6 + review need a plan ("Upgrade" opens the plans modal).
 */
export function PathwayView({ plan }: { plan: "free" | "paid" }) {
  const free = plan === "free";
  const [banner, setBanner] = useState(true);
  const [workOpen, setWorkOpen] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const yuki = characters.yuki;

  const completed = free ? 3 : 1;
  const next = workLessons[completed];
  const nextLocked = free && !!next.paid;
  const starsEarned = workLessons.slice(0, completed).reduce((s, l) => s + (l.stars ?? 0), 0);

  return (
    <div className="flex min-h-screen bg-white">
      <AppRail active="pathway" />

      <main className="min-w-0 flex-1">
        {free && banner && (
          <div className="flex h-[45px] items-center gap-3 border-b border-line-panel bg-surface-tint px-6 font-display text-[13px]">
            <div className="mx-auto flex w-full max-w-[880px] items-center gap-3">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-white">
                <Sparkles className="size-3" aria-hidden />
              </span>
              <p className="flex-1 truncate">
                <span className="font-semibold text-text-primary">Unlock all lessons – $7.99 / month</span>
                <span className="text-text-secondary"> · Access all 5 sections and practice mistake review.</span>
              </p>
              <button
                type="button"
                onClick={() => setPlansOpen(true)}
                className="rounded-[8px] bg-brand-primary px-3 py-1 text-xs font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                See plans
              </button>
            </div>
            <button
              type="button"
              aria-label="Hide banner"
              onClick={() => setBanner(false)}
              className="flex size-7 items-center justify-center rounded-full text-text-secondary outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        )}

        <div className={cn("mx-auto flex w-full max-w-[880px] flex-col px-6", free ? "gap-5 pt-4 pb-10" : "gap-10 pt-9 pb-16")}>
          {/* Greeting */}
          <div className="flex items-start justify-between">
            <div>
              {/* SAMPLE DATA: greeting + name */}
              <h1 className="font-display text-[24px] leading-8 font-semibold tracking-[-0.3px] text-text-primary">
                Good afternoon, Alex
              </h1>
              <p className="pt-0.5 text-sm leading-5 text-text-secondary">
                Section 1 of 5 <span aria-hidden className="text-slate-300">•</span> Work
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3.5 py-1.5 font-display text-sm font-semibold text-amber-900">
              <span aria-hidden>⭐</span>
              415 XP
            </span>
          </div>

          {/* Up next */}
          <section
            aria-label="Up next"
            className="flex items-center gap-5 rounded-[20px] border border-line bg-white px-7 py-6"
          >
            <span className="relative">
              <Avatar src={yuki.avatar} alt={yuki.name} size={56} />
              {!nextLocked && (
                <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-white bg-success" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xs leading-4 font-semibold tracking-[0.6px] text-brand-secondary-text">UP NEXT</p>
              <h2 className="flex items-center gap-1.5 pt-1 font-display text-[17px] leading-6 font-semibold text-text-primary">
                {next.title}
                {nextLocked && <Lock className="size-3.5 text-text-secondary" aria-label="Locked" />}
              </h2>
              <p className="flex items-center gap-1.5 pt-0.5 text-[13px] leading-5 text-text-secondary">
                Work <span aria-hidden className="text-slate-300">•</span> Lesson {completed + 1} of {workLessons.length}
                <span aria-hidden className="text-slate-300">•</span>
                <Clock className="size-3.5" aria-hidden /> ~3 min
              </p>
            </div>
            {nextLocked ? (
              <button
                type="button"
                onClick={() => setPlansOpen(true)}
                className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-5 font-display text-sm font-semibold text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Unlock all lessons
                <ArrowRight className="size-4" aria-hidden />
              </button>
            ) : (
              <Link
                href="/lesson"
                className="flex h-11 items-center gap-2 rounded-[12px] bg-brand-primary px-6 font-display text-[15px] font-medium text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
          </section>

          {/* Your path */}
          <section aria-labelledby="your-path" className="flex flex-col gap-4">
            <h2 id="your-path" className="font-display text-xl leading-7 font-semibold text-text-primary">
              Your path
            </h2>

            {/* Section 1: Work */}
            <article className="overflow-hidden rounded-[20px] border border-line bg-white">
              <header className={cn("flex items-center gap-4 px-6", free ? "py-4" : "py-6")}>
                <Avatar src={yuki.avatar} alt={yuki.name} size={free ? 40 : 48} />
                <div className="flex-1">
                  <p className="flex items-center gap-2">
                    <span className="font-display text-[17px] leading-6 font-semibold text-text-primary">Work</span>
                    <span className="rounded-full bg-brand-primary px-2 py-0.5 font-display text-[11px] leading-4 font-semibold tracking-[0.3px] text-white">
                      CURRENT
                    </span>
                  </p>
                  <p className="text-[13px] leading-5 text-text-secondary">Yuki Tanaka, your manager</p>
                </div>
                <div className={cn("flex items-center gap-2", !free && "flex-col items-end gap-1")}>
                  {!free && (
                    <span className="font-display text-xs font-semibold text-text-primary">
                      {completed} of {workLessons.length} lessons
                    </span>
                  )}
                  <span
                    role="progressbar"
                    aria-label="Work progress"
                    aria-valuemin={0}
                    aria-valuemax={workLessons.length}
                    aria-valuenow={completed}
                    className="block h-1 w-24 overflow-hidden rounded-full bg-surface-tint"
                  >
                    <span
                      className="block h-full rounded-full bg-brand-primary"
                      style={{ width: `${(completed / workLessons.length) * 100}%` }}
                    />
                  </span>
                  {free && (
                    <span className="font-display text-[13px] text-text-secondary">
                      {completed} of {workLessons.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  aria-expanded={workOpen}
                  aria-label={workOpen ? "Collapse section" : "Expand section"}
                  onClick={() => setWorkOpen((v) => !v)}
                  className="flex size-8 items-center justify-center rounded-full text-text-secondary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ChevronUp className={cn("size-4 transition-transform", !workOpen && "rotate-180")} aria-hidden />
                </button>
              </header>

              {workOpen &&
                (free ? (
                  <ol className="divide-y divide-line border-t border-line bg-surface-page/60">
                    <li>
                      <div className="flex items-center gap-4 px-6 py-3">
                        <DoneDot />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-[13px] font-semibold text-text-primary">
                            {completed} lessons completed
                          </p>
                          <p className="truncate text-[13px] text-text-secondary">
                            {workLessons.slice(0, completed).map((l) => l.title).join(" · ")}
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
                          {showDone ? "Hide" : "Show"}
                        </button>
                      </div>
                      {showDone && (
                        <ul className="flex flex-col gap-1 px-6 pb-3 pl-[68px]">
                          {workLessons.slice(0, completed).map((l) => (
                            <li key={l.title} className="flex items-center justify-between text-[13px] text-text-secondary">
                              {l.title}
                              <Stars value={l.stars ?? 0} size={12} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                    {workLessons.slice(completed).map((l) => (
                      <CompactRow key={l.title} title={l.title} subtitle={l.subtitle} onUpgrade={() => setPlansOpen(true)} />
                    ))}
                    <CompactRow title="Section review" subtitle="Quick test of all 6 lessons" review onUpgrade={() => setPlansOpen(true)} />
                  </ol>
                ) : (
                  <ol className="flex flex-col gap-1 border-t border-line px-4 py-4">
                    {workLessons.map((l, i) => (
                      <LessonRow
                        key={l.title}
                        index={i + 1}
                        lesson={l}
                        status={i < completed ? "done" : i === completed ? "current" : "locked"}
                      />
                    ))}
                    <li className="flex items-center gap-4 rounded-2xl px-4 py-3" aria-label="Section review, locked">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-action-accent/10 text-brand-secondary-text">
                        <Trophy className="size-3.5" aria-hidden />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[15px] leading-5 text-text-primary">Section review</span>
                        <span className="block font-display text-xs font-medium text-text-primary">
                          Quick test of all 6 lessons
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
                  aria-label={`${s.title}, locked`}
                  className={cn("flex items-center gap-4 rounded-[20px] border border-line bg-white px-6", free ? "py-3" : "py-4")}
                >
                  <Avatar src={c.avatar} alt={c.name} size={free ? 36 : 44} grayscale />
                  <div className="flex-1">
                    <p className={cn("font-display font-semibold text-text-primary", free ? "text-[13px]" : "text-[17px]")}>
                      {s.title}
                    </p>
                    <p className="text-[13px] text-text-secondary">{s.description}</p>
                  </div>
                  <span className="flex items-center gap-2 font-display text-[13px] text-text-secondary">
                    {s.hint}
                    <Lock className="size-4" aria-hidden />
                  </span>
                </article>
              );
            })}

            <div className="flex items-center gap-3 rounded-[20px] border border-line bg-surface-page px-6 py-4">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-surface-tint text-text-primary">
                <Compass className="size-4" aria-hidden />
              </span>
              <p className="flex-1 font-display text-[13px] text-text-secondary">
                <span className="font-semibold text-text-primary">Travel</span> <span aria-hidden>·</span> Coming soon
              </p>
              {/* TODO: waitlist */}
              <button
                type="button"
                className="rounded-sm font-display text-[13px] font-semibold text-text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                Notify me
              </button>
            </div>
          </section>
        </div>
      </main>

      <PlansDialog
        open={plansOpen}
        onOpenChange={setPlansOpen}
        onNotNow={() => {}}
        title="Unlock every lesson"
      />
    </div>
  );
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
  lesson: { title: string; subtitle: string; stars?: number };
  status: "done" | "current" | "locked";
}) {
  const body = (
    <>
      {status === "done" ? (
        <DoneDot />
      ) : status === "current" ? (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
          <Play className="size-3 fill-white" aria-hidden />
        </span>
      ) : (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-tint text-text-primary">
          <Lock className="size-3.5" aria-hidden />
        </span>
      )}
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] leading-5 text-text-primary">{lesson.title}</span>
        {status !== "locked" && (
          <span className="block truncate font-display text-xs leading-5 font-medium text-text-primary">
            {status === "done" ? `Completed · ${lesson.subtitle}` : lesson.subtitle}
          </span>
        )}
      </span>
      {status === "done" && lesson.stars !== undefined && <Stars value={lesson.stars} size={13} />}
      {status === "locked" && <span className="font-display text-xs font-semibold text-text-primary">Lesson {index}</span>}
    </>
  );

  const base = "flex w-full items-center gap-4 rounded-2xl px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <li>
      {status === "current" ? (
        <Link href="/lesson" className={cn(base, "border border-draft-line bg-surface-tint")}>
          {body}
        </Link>
      ) : (
        <div className={base} aria-label={status === "locked" ? `${lesson.title}, locked` : undefined}>
          {body}
        </div>
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
        aria-label={`${title}, locked. Upgrade to unlock`}
        className="rounded-full border border-brand-secondary-text bg-white px-2.5 py-0.5 font-display text-[13px] font-semibold text-brand-secondary-text outline-none hover:bg-error-tint focus-visible:ring-2 focus-visible:ring-ring"
      >
        Upgrade
      </button>
    </li>
  );
}
