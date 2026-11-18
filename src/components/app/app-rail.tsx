"use client";

import { Bookmark, GraduationCap, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { loadProfile, profileInitial } from "@/lib/profile";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/pathway", label: "Pathway", icon: GraduationCap },
  { href: "/lesson", label: "Chats", icon: MessageCircle },
  { href: "/phrases", label: "Phrases", icon: Bookmark },
];

/**
 * Left icon rail (72px) — one Sidebar Nav component for every app screen
 * (resolves the "72px vs 63px" open note in Figma).
 */
export function AppRail({ active }: { active?: "pathway" | "chats" | "phrases" | "settings" }) {
  const pathname = usePathname();
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      setInitial(profileInitial(result.profile.display_name, result.email));
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <aside className="sticky top-0 flex h-screen w-[72px] shrink-0 flex-col items-center justify-between border-r border-slate-200 bg-white py-5">
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
                <span className="pt-1">{label}</span>
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
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full bg-surface-tint font-display text-base font-semibold text-text-primary shadow-[0_0_0_2px_#e2e8f0]",
            active === "settings" && "shadow-[0_0_0_2px_var(--brand-primary)]"
          )}
        >
          {initial}
        </span>
        <span className="absolute -right-1 -bottom-1 rounded-full border border-white bg-brand-secondary-text px-[7px] py-[3px] font-display text-[11px] leading-[10px] font-bold text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          L2
        </span>
      </Link>
    </aside>
  );
}
