"use client";

import { CreditCard, Globe, Lightbulb, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { loadProfile, planLabel, profileInitial } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/settings", label: "Profile", icon: User },
  { href: "/settings/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings/language", label: "Language & learning", icon: Globe },
  { href: "/settings/features", label: "Suggest a feature", icon: Lightbulb },
];

/** Settings side panel (D-SET-01…06). Name, email and plan come from the profile. */
export function SettingsNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Free plan");

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      setName(result.profile.display_name?.trim() || result.email);
      setEmail(result.email);
      setPlan(planLabel(result.profile.plan));
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const logOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/signup");
    router.refresh();
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary font-display text-sm font-semibold text-white">
          {profileInitial(name, email)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-between gap-2">
            <span className="truncate font-display text-[15px] leading-5 font-semibold text-text-primary">
              {name || "Your account"}
            </span>
            <span className="shrink-0 rounded-full border border-line bg-surface-page px-2 py-0.5 font-display text-[11px] font-medium text-text-secondary">
              {plan}
            </span>
          </p>
          <p className="truncate text-xs text-text-secondary">{email}</p>
        </div>
      </div>

      <nav aria-label="Settings" className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-[8px] px-3 font-display text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-surface-tint font-semibold text-text-primary"
                  : "text-text-secondary hover:bg-surface-page hover:text-text-primary"
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <p className="flex items-center justify-center gap-2 border-t border-slate-200 py-4 text-xs text-text-secondary">
        <a href="#" className="hover:underline">Terms</a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:underline">Privacy</a>
        <span aria-hidden>·</span>
        <button type="button" onClick={logOut} className="hover:underline">
          Log out
        </button>
      </p>
    </aside>
  );
}

/** Page heading + column used by every settings page. */
export function SettingsPage({
  title,
  description,
  width = 560,
  action,
  children,
}: {
  title: string;
  description?: string;
  width?: 560 | 640 | 720;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-8 pt-10 pb-12">
      <div className="mx-auto flex flex-col gap-6" style={{ maxWidth: width }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] leading-9 font-bold tracking-[-0.3px] text-text-primary">{title}</h1>
            {description && <p className="pt-1 text-[15px] text-text-secondary">{description}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </main>
  );
}
