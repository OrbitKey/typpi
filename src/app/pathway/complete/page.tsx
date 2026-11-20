"use client";

import { ArrowRight, Award, BookOpen, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { Avatar } from "@/components/chat/avatar";
import { useLocale } from "@/components/i18n/locale-provider";
import { characters } from "@/lib/characters";
import { workLessons } from "@/lib/pathway";
import { loadLessonProgress } from "@/lib/progress";

const starsPerLesson = 3;

/** D-PTH-03 · Section complete: Work. Opens only after every Work lesson is finished. */
export default function SectionCompletePage() {
  const yuki = characters.yuki;
  const { t } = useLocale();
  const router = useRouter();
  const [stats, setStats] = useState<{ xp: number; stars: number; lessons: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadLessonProgress().then((rows) => {
      if (cancelled) return;
      const byId = new Map(rows.map((row) => [row.lesson_id, row]));
      const done = workLessons.filter((lesson) => byId.has(lesson.id));
      if (done.length < workLessons.length) {
        router.replace("/pathway");
        return;
      }
      setStats({
        xp: done.reduce((sum, lesson) => sum + (byId.get(lesson.id)?.xp ?? 0), 0),
        stars: done.reduce((sum, lesson) => sum + (byId.get(lesson.id)?.stars ?? 0), 0),
        lessons: done.length,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen bg-white">
      <AppRail active="pathway" />
      <main className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden px-8 py-16">
        <span aria-hidden className="pointer-events-none absolute top-[6%] left-1/2 size-[440px] -translate-x-1/2 rounded-full bg-action-accent/[0.06] blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute bottom-[-8%] left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-surface-tint blur-3xl" />

        {stats && (
          <section className="relative flex w-full max-w-[560px] flex-col items-center rounded-3xl bg-white px-10 py-11 text-center shadow-[0_10px_40px_-20px_rgba(36,42,48,0.18)]">
            <span className="relative">
              <span aria-hidden className="absolute -inset-1 rounded-full bg-action-accent/15 motion-safe:animate-pulse" />
              <span className="relative block rounded-full border-[3px] border-action-accent">
                <Avatar src={yuki.avatar} alt={yuki.name} size={90} />
              </span>
              <span className="absolute -bottom-2 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-action-accent text-white">
                <Award className="size-4" aria-hidden />
              </span>
            </span>

            <h1 className="pt-7 font-display text-[28px] leading-9 font-bold text-ink">
              {t("secCompleteTitle", { section: t("pathWork") })}
            </h1>
            <p className="pt-2 text-[15px] leading-6 text-text-secondary">{t("secCompleteBody")}</p>

            <p className="mt-5 flex items-center gap-3 rounded-full bg-surface-tint px-5 py-2.5 font-display text-sm font-semibold text-text-primary">
              <span className="flex items-center gap-1">
                <Zap className="size-4 fill-brand-secondary-text text-brand-secondary-text" aria-hidden />
                +{stats.xp} XP
              </span>
              <span aria-hidden className="text-slate-300">•</span>
              <span>
                {stats.stars} / {workLessons.length * starsPerLesson} <span className="text-action-accent">★</span>
              </span>
              <span aria-hidden className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <BookOpen className="size-4" aria-hidden />
                {t("secCompleteLessons", { count: String(stats.lessons) })}
              </span>
            </p>

            <div className="flex w-full max-w-[360px] flex-col items-center gap-3 pt-6">
              <Link
                href="/pathway#section-home"
                className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary font-display text-[15px] font-medium text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("secCompleteNext", { section: t("secHome") })}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/pathway"
                className="rounded-sm px-3 py-1 font-display text-[13px] text-text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t("secCompleteBack")}
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
