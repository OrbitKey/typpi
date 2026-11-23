"use client";

import { Bell, ChevronLeft, ChevronRight, CreditCard, Globe, Languages, Lightbulb, User, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { type MessageKey } from "@/lib/i18n";
import { languages } from "@/lib/onboarding";
import { loadProfile, profileInitial } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links: { href: string; label: MessageKey; icon: typeof User }[] = [
  { href: "/settings", label: "profile", icon: User },
  { href: "/settings/subscription", label: "subscription", icon: CreditCard },
  { href: "/settings/language", label: "languageLearning", icon: Globe },
  { href: "/settings/features", label: "suggestFeature", icon: Lightbulb },
];

/** Settings side panel (D-SET-01…06). Name, email and plan come from the profile. */
export function SettingsNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const { t } = useLocale();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      setName(result.profile.display_name?.trim() || result.email);
      setEmail(result.email);
      setPlan(result.profile.plan || "free");
      setAvatarUrl(result.profile.avatar_url);
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
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-10 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary font-display text-sm font-semibold text-white">
            {profileInitial(name, email)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-between gap-2">
            <span className="truncate font-display text-[15px] leading-5 font-semibold text-text-primary">
              {name || t("yourAccount")}
            </span>
            <span className="shrink-0 rounded-full border border-line bg-surface-page px-2 py-0.5 font-display text-[11px] font-medium text-text-secondary">
              {plan === "individual" ? t("individual") : plan === "premium" ? t("premium") : t("freePlan")}
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
              {t(label)}
            </Link>
          );
        })}
      </nav>

      <p className="flex items-center justify-center gap-2 border-t border-slate-200 py-4 text-xs text-text-secondary">
        <Link href="/terms" className="hover:underline">{t("terms")}</Link>
        <span aria-hidden>·</span>
        <Link href="/privacy" className="hover:underline">{t("privacy")}</Link>
        <span aria-hidden>·</span>
        <button type="button" onClick={logOut} className="hover:underline">
          {t("logOut")}
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
  back = false,
  children,
}: {
  title: string;
  description?: string;
  width?: 560 | 640 | 720;
  action?: React.ReactNode;
  /** Phone header returns to the profile menu. */
  back?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-28 md:px-8 md:pt-10 md:pb-12">
      <div className="mx-auto flex flex-col gap-5 md:gap-6" style={{ maxWidth: width }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              {back && (
                <Link
                  href="/settings"
                  aria-label="Back"
                  className="-ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </Link>
              )}
              <h1 className="font-display text-[22px] leading-7 font-bold text-text-primary md:text-[28px] md:leading-9 md:tracking-[-0.3px]">
                {title}
              </h1>
            </div>
            {description && <p className="pt-2 text-[15px] leading-6 text-text-secondary md:pt-1">{description}</p>}
          </div>
          {action && <div className="max-md:[&_button]:h-12 max-md:[&_button]:w-full">{action}</div>}
        </div>
        {children}
      </div>
    </main>
  );
}

/** Phone profile menu. The wide layout keeps this as the side panel. */
export function MobileSettingsHome() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const languageName = languages.find((item) => item.code === locale)?.english ?? "English";

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      setName(result.profile.display_name?.trim() || result.email);
      setEmail(result.email);
      setPlan(result.profile.plan || "free");
      setAvatarUrl(result.profile.avatar_url);
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

  const planLabel = plan === "individual" ? t("individual") : plan === "premium" ? t("premium") : t("freePlan");
  const rows: { href: string; label: MessageKey; icon: typeof User; extra?: string }[] = [
    { href: "/settings/account", label: "profile", icon: User },
    { href: "/settings/subscription", label: "subscription", icon: CreditCard },
    { href: "/settings/language", label: "languageLearning", icon: Languages, extra: languageName },
    { href: "/settings/features", label: "suggestFeature", icon: Lightbulb },
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-28 md:hidden">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-[22px] leading-7 font-bold text-text-primary">{t("profile")}</h1>
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center text-text-primary" aria-hidden>
            <Bell className="size-5" strokeWidth={1.75} />
          </span>
          <Link
            href="/settings/account"
            aria-label={t("profile")}
            className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand-primary text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {avatarUrl ? <img src={avatarUrl} alt="" className="size-8 object-cover" /> : <UserRound className="size-4" aria-hidden />}
          </Link>
        </div>
      </header>

      <div className="flex flex-col items-center pt-6 pb-5 text-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-20 rounded-full object-cover" />
        ) : (
          <span className="flex size-20 items-center justify-center rounded-full bg-brand-primary font-display text-2xl font-semibold text-white">
            {profileInitial(name, email)}
          </span>
        )}
        <p className="pt-3 font-display text-lg leading-6 font-semibold text-text-primary">{name || t("yourAccount")}</p>
        <p className="pt-0.5 text-sm text-text-secondary">{email}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-display text-xs font-medium text-text-secondary">
          <span aria-hidden className="size-1.5 rounded-full bg-action-accent" />
          {planLabel}
        </span>
      </div>

      <nav aria-label="Settings" className="overflow-hidden rounded-[20px] border border-line bg-white">
        {rows.map(({ href, label, icon: Icon, extra }, index) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-ring",
              index > 0 && "border-t border-line"
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-surface-tint text-text-primary">
              <Icon className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="min-w-0 flex-1 font-display text-[15px] font-medium text-text-primary">{t(label)}</span>
            {extra && <span className="text-sm text-text-secondary">{extra}</span>}
            <ChevronRight className="size-4 shrink-0 text-text-secondary" aria-hidden />
          </Link>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-4 pt-6">
        <p className="flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/terms" className="hover:underline">{t("terms")}</Link>
          <span aria-hidden>·</span>
          <Link href="/privacy" className="hover:underline">{t("privacy")}</Link>
        </p>
        <button type="button" onClick={logOut} className="font-display text-[15px] font-semibold text-error">
          {t("logOut")}
        </button>
      </div>
    </main>
  );
}
