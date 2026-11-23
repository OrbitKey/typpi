"use client";

import { Bookmark, GraduationCap, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { type MessageKey } from "@/lib/i18n";
import { loadProfile, profileInitial } from "@/lib/profile";
import { cn } from "@/lib/utils";

const nav: { href: string; mobileHref?: string; label: MessageKey; icon: typeof GraduationCap }[] = [
  { href: "/pathway", label: "pathway", icon: GraduationCap },
  { href: "/lesson", mobileHref: "/chats", label: "chats", icon: MessageCircle },
  { href: "/phrases", label: "phrases", icon: Bookmark },
];

/**
 * Left icon rail (72px) — one Sidebar Nav component for every app screen
 * (resolves the "72px vs 63px" open note in Figma).
 */
export function AppRail({
  active,
  mobileNav = false,
}: {
  active?: "pathway" | "chats" | "phrases" | "settings";
  /** Phone layout: bottom tabs instead of the side rail. */
  mobileNav?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useLocale();
  const [initial, setInitial] = useState("?");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      setInitial(profileInitial(result.profile.display_name, result.email));
      setAvatarUrl(result.profile.avatar_url);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const tabs: { href: string; label: MessageKey; icon: typeof GraduationCap; key: NonNullable<typeof active> }[] = [
    ...nav.map((item) => ({
      href: item.mobileHref ?? item.href,
      label: item.label,
      icon: item.icon,
      key: item.label as "pathway" | "chats" | "phrases",
    })),
    { href: "/settings", label: "profile", icon: UserRound, key: "settings" },
  ];

  return (
    <>
    {mobileNav && (
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white px-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] md:hidden"
      >
        {tabs.map(({ href, label, icon: Icon, key }) => {
          const isActive = active ? key === active : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1.5 font-display text-[11px] leading-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive ? "font-semibold text-text-primary" : "font-medium text-text-secondary"
              )}
            >
              <span className={cn("flex h-7 items-center rounded-full px-3", isActive && "bg-surface-tint")}>
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              {t(label)}
            </Link>
          );
        })}
      </nav>
    )}
    <aside className={cn(
      "sticky top-0 h-screen w-[72px] shrink-0 flex-col items-center justify-between border-r border-slate-200 bg-white py-5",
      mobileNav ? "hidden md:flex" : "flex"
    )}>
      <div className="flex w-full flex-col items-center gap-7">
        <Link
          href="/pathway"
          aria-label="Typpi home"
          className="flex items-start rounded-md font-display text-[18px] leading-7 font-bold tracking-[-0.45px] text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Typpi
          <span aria-hidden className="mt-0 ml-0.5 size-2 rounded-full bg-action-accent" />
        </Link>

        <nav aria-label="Main" className="flex w-full flex-col gap-3 px-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const isActive = active
              ? label.toLowerCase() === active
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-[12px] py-2.5 font-display text-xs leading-[11px] outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-surface-tint font-semibold text-text-primary"
                    : "font-medium text-text-secondary hover:bg-surface-page"
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                <span className="pt-1">{t(label)}</span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute top-2 bottom-2 -left-2 w-1 rounded-r-[6px] bg-brand-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/settings"
        aria-label="Profile and settings · Level 2"
        className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className={cn(
              "size-10 rounded-full object-cover shadow-[0_0_0_2px_#e2e8f0]",
              active === "settings" && "shadow-[0_0_0_2px_var(--brand-primary)]"
            )}
          />
        ) : (
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full bg-surface-tint font-display text-base font-semibold text-text-primary shadow-[0_0_0_2px_#e2e8f0]",
              active === "settings" && "shadow-[0_0_0_2px_var(--brand-primary)]"
            )}
          >
            {initial}
          </span>
        )}
        <span className="absolute -right-1 -bottom-1 rounded-full border border-white bg-brand-secondary-text px-[7px] py-[3px] font-display text-[11px] leading-[10px] font-bold text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          L2
        </span>
      </Link>
    </aside>
    </>
  );
}
