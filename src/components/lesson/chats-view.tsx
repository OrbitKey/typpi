"use client";

import { Bell, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { Avatar } from "@/components/chat/avatar";
import { useLocale } from "@/components/i18n/locale-provider";
import { characters } from "@/lib/characters";
import { runningLate } from "@/lib/lesson";
import { loadProfile } from "@/lib/profile";
import { loadLessonProgress } from "@/lib/progress";

/**
 * Phone inbox. Hana stays a preview: there is no separate thread.
 * Wide screens keep the list as the lesson sidebar, so this route returns there.
 */
export function ChatsView() {
  const router = useRouter();
  const { t } = useLocale();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const leave = () => {
      if (wide.matches) router.replace("/lesson");
    };
    leave();
    wide.addEventListener("change", leave);
    return () => wide.removeEventListener("change", leave);
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (!cancelled && result) setAvatarUrl(result.profile.avatar_url);
    });
    loadLessonProgress().then((rows) => {
      if (!cancelled) setDone(rows.some((row) => row.lesson_id === "running-late"));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const yukiPreview = runningLate.reply.lines.flat().map((part) => part.text).join("");
  const progress = done
    ? `${runningLate.totalSteps}/${runningLate.totalSteps}`
    : `${runningLate.step + 1}/${runningLate.totalSteps}`;

  return (
    <div className="flex min-h-dvh bg-white">
      <AppRail active="chats" mobileNav />
      <main className="flex min-h-dvh min-w-0 flex-1 flex-col pb-24 md:hidden">
        <header className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
          <h1 className="flex items-center gap-2 font-display text-[22px] leading-7 font-bold text-text-primary">
            <span aria-hidden className="size-2.5 rounded-full bg-action-accent" />
            {t("chats")}
          </h1>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center text-text-primary" aria-hidden>
              <Bell className="size-5" strokeWidth={1.75} />
            </span>
            <Link
              href="/settings"
              aria-label={t("profile")}
              className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand-primary text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {avatarUrl ? (
                <Avatar src={avatarUrl} alt="" size={32} />
              ) : (
                <UserRound className="size-4" aria-hidden />
              )}
            </Link>
          </div>
        </header>

        <ul className="flex flex-col">
          <li className="border-b border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar src={characters.hana.avatar} alt="" size={48} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-display text-[15px] leading-5 font-bold text-text-primary">{characters.hana.name}</span>
                  <span className="truncate font-display text-[13px] leading-5 text-text-secondary">{characters.hana.role}</span>
                </span>
                <span className="block truncate font-display text-[13px] leading-5 text-text-secondary">
                  Tip: {runningLate.cultureTip}
                </span>
              </span>
            </div>
          </li>
          <li className="border-b border-slate-100">
            <Link
              href="/lesson"
              className="flex items-center gap-3 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar src={characters.yuki.avatar} alt="" size={48} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="shrink-0 font-display text-[15px] leading-5 font-bold text-text-primary">{characters.yuki.name}</span>
                  <span className="truncate font-display text-[13px] leading-5 text-text-secondary">
                    {characters.yuki.role} · Work
                  </span>
                </span>
                <span lang="ja" className="block truncate font-jp text-[13px] leading-5 text-text-secondary">
                  {yukiPreview}
                </span>
              </span>
              <span className="shrink-0 font-display text-[13px] leading-5 text-text-secondary">{progress}</span>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
