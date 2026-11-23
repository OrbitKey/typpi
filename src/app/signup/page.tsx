"use client";

import { AlarmClock, ArrowLeft, ArrowRight, Check, Clock, Mail, RotateCw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/chat/avatar";
import { GuideBubble } from "@/components/chat/bubbles";
import { useLocale } from "@/components/i18n/locale-provider";
import { ChoiceGroup } from "@/components/onboarding/choice-cards";
import { Label } from "@/components/ui/label";
import { Stars } from "@/components/ui/stars";
import { Switch } from "@/components/ui/switch";
import { characters } from "@/lib/characters";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Step = "start" | "email" | "sent" | "goal";

const goals = ["5", "10", "15"] as const;

/** D-ACC-01…04 · Save your progress → email → magic link → daily goal */
export default function SignupPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [step, setStep] = useState<Step>("start");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [goal, setGoal] = useState("10");
  const [reminder, setReminder] = useState(false);
  const [time, setTime] = useState("19:00");
  const [resent, setResent] = useState(false);
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "email") emailRef.current?.focus();
  }, [step]);

  // Returning from the magic link: the callback set the session, then sent us here.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const failed = params.get("error") === "auth";
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        if (failed) {
          setEmailError(t("signAuthError"));
          setStep("start");
        }
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_goal_minutes")
        .eq("id", data.user.id)
        .maybeSingle();
      if (!profile) {
        await supabase.auth.signOut();
        setStep("start");
        return;
      }
      if (typeof profile.daily_goal_minutes === "number") {
        router.replace("/pathway");
        return;
      }
      setStep("goal");
      setEmailError("");
      if (failed) router.replace("/signup");
    });
  }, []);

  const sendLink = async () => {
    setSending(true);
    setEmailError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setSending(false);
    if (error) {
      setEmailError(error.message);
      return false;
    }
    return true;
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t("signBadEmail"));
      return;
    }
    if (await sendLink()) setStep("sent");
  };

  const resendLink = async () => {
    if (await sendLink()) setResent(true);
  };

  const saveGoal = async () => {
    setSaving(true);
    setEmailError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      setEmailError(t("signSignInAgain"));
      setStep("email");
      return;
    }

    const patch: {
      daily_goal_minutes: number;
      reminder_enabled: boolean;
      reminder_time: string;
      language?: string;
      purpose?: string;
      level?: string;
      travel_notify?: boolean;
    } = {
      daily_goal_minutes: Number(goal),
      reminder_enabled: reminder,
      reminder_time: time,
    };

    try {
      const saved = JSON.parse(sessionStorage.getItem("typpi.onboarding") ?? "null");
      if (saved && typeof saved === "object") {
        if (typeof saved.language === "string") patch.language = saved.language;
        if (saved.purpose === "work" || saved.purpose === "daily") patch.purpose = saved.purpose;
        if (saved.level === "never" || saved.level === "little" || saved.level === "confident") {
          patch.level = saved.level;
        }
        if (saved.travelNotify === true) patch.travel_notify = true;
      }
    } catch {
      // Onboarding was never stored in this tab.
    }

    let { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (error && patch.travel_notify) {
      const { travel_notify: _travelNotify, ...rest } = patch;
      const retry = await supabase.from("profiles").update(rest).eq("id", user.id);
      error = retry.error;
    }
    setSaving(false);
    if (error) {
      setEmailError(error.message);
      return;
    }
    router.push("/pathway");
  };

  const lessonParts = t("signLessonComplete").split(" · ");
  const lessonTitle = lessonParts[0] ?? t("signLessonComplete");
  const lessonName = lessonParts[1] ?? "";

  return (
    <div className="flex min-h-dvh justify-center bg-white px-4 pt-2 pb-6 md:min-h-screen md:pt-[120px] md:pb-[120px]">
      <div className="flex w-full max-w-[608px] flex-col">
        <header className="flex h-14 items-center justify-between md:h-[52px]">
          <div className="flex items-center gap-2">
            {(step === "email" || step === "sent") && (
              <button
                type="button"
                aria-label="Back"
                onClick={() => setStep(step === "sent" ? "email" : "start")}
                className="flex size-8 items-center justify-center rounded-full text-ink outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              >
                <ArrowLeft className="size-5" aria-hidden />
              </button>
            )}
            <Logo size="small" className="md:hidden" />
            <Logo size="medium" className="hidden md:inline-flex" />
          </div>
          {step === "start" && (
            <button
              type="button"
              aria-label="Close"
              onClick={() => router.back()}
              className="flex size-8 items-center justify-center rounded-full text-ink outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            >
              <X className="size-5" aria-hidden />
            </button>
          )}
        </header>

        <div className="flex flex-col gap-4 pt-1">
          {step === "start" && (
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 md:border-0 md:p-4 md:shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <Avatar src={characters.yuki.avatar} alt="Yuki Tanaka" size={44} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="font-display text-[15px] font-semibold text-text-primary">{t("signLessonComplete")}</p>
                <p className="flex items-center gap-2">
                  <Stars value={2} size={12} />
                  <span className="hidden rounded-full bg-action-accent/15 px-1.5 py-px font-display text-[11px] leading-4 font-bold text-brand-secondary-text md:inline">
                    +60 XP
                  </span>
                </p>
              </div>
              <span className="font-display text-[13px] font-bold text-brand-secondary-text md:hidden">+60 XP</span>
            </div>
          )}

          {(step === "email" || step === "sent") && (
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 md:hidden">
              <span className="relative shrink-0">
                <Avatar src={characters.yuki.avatar} alt="Yuki Tanaka" size={44} />
                <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-success" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] leading-5 font-semibold text-text-primary">{lessonTitle}</p>
                {lessonName ? <p className="text-sm leading-5 text-text-secondary">{lessonName}</p> : null}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Stars value={2} size={12} />
                <span className="rounded-full bg-surface-tint px-2 py-0.5 font-display text-[11px] leading-4 font-bold text-brand-secondary-text">
                  +60 XP
                </span>
              </div>
            </div>
          )}

          {(step === "start" || step === "email") && (
            <HanaSays label={step === "start" ? true : "mobile"}>
              <GuideBubble size="sm" tail="tl">
                {t("signGreat")} <span aria-hidden>🎉</span>
              </GuideBubble>
              <GuideBubble size="sm" tail="none">
                {t("signSaveProgress")}
              </GuideBubble>
            </HanaSays>
          )}

          {step === "email" && (
            <div className="hidden md:block">
              <SentBubble>{t("signContinueEmail")}</SentBubble>
            </div>
          )}

          {step === "sent" && (
            <>
              <div className="hidden md:block">
                <SentBubble>{email}</SentBubble>
              </div>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2">
                  <Avatar src={characters.hana.avatar} alt="Hana" size={32} />
                  <span className="font-display text-xs leading-4 font-bold tracking-[0.6px] text-text-secondary">HANA</span>
                </span>
                <div className="flex flex-col gap-1.5 pl-8">
                  <GuideBubble size="sm" tail="tl">
                    {t("signCheckInbox")} <span aria-hidden>✉️</span>
                  </GuideBubble>
                  <GuideBubble size="sm" tail="none">
                    {t("signSentTo")}{" "}
                    <span className="font-semibold text-text-primary underline decoration-action-accent underline-offset-4">
                      {email}
                    </span>
                    . {t("signOpenDevice")}
                  </GuideBubble>
                </div>
              </div>
            </>
          )}

          {step === "goal" && (
            <>
              <div className="flex items-start gap-3">
                <span className="relative shrink-0">
                  <Avatar src={characters.hana.avatar} alt="Hana" size={40} />
                  <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-success" />
                </span>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="font-display text-xs leading-4 font-bold tracking-[0.6px] text-text-secondary md:hidden">
                    HANA
                  </span>
                  <GuideBubble size="md" tail="tl" className="max-w-[394px]">
                    {t("signYoureIn")}
                  </GuideBubble>
                </div>
              </div>

              <ChoiceGroup
                label={t("signChooseGoal")}
                value={goal}
                onValueChange={setGoal}
                className="flex flex-col gap-3 pt-1 md:grid md:grid-cols-3 md:gap-2 md:pt-3"
              >
                {goals.map((minutes) => {
                  const selected = goal === minutes;
                  const goalLabel = minutes === "5" ? t("signCasual") : minutes === "15" ? t("signSerious") : t("signRegular");
                  return (
                    <RadioGroupPrimitive.Item
                      key={minutes}
                      value={minutes}
                      className={cn(
                        "relative flex h-14 items-center justify-between rounded-2xl border px-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-[82px] md:flex-col md:items-start md:justify-center",
                        selected ? "border-brand-primary bg-surface-tint max-md:border-2" : "border-line bg-white hover:bg-surface-page"
                      )}
                    >
                      <span className="font-display text-[15px] font-semibold text-text-primary md:hidden">
                        {minutes} {t("signMin")} – {goalLabel}
                      </span>
                      <span className="hidden items-baseline font-display md:flex">
                        <span className="text-xl leading-7 font-bold text-text-primary">{minutes}</span>
                        <span className="text-sm text-text-secondary">{t("signMin")}</span>
                      </span>
                      <span className={cn("hidden text-sm leading-5 md:inline", selected ? "font-semibold text-text-primary" : "text-text-secondary")}>
                        {goalLabel}
                      </span>
                      {selected && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-brand-primary text-white md:absolute md:top-4 md:right-4 md:size-4">
                          <Check className="size-3 md:size-2.5" strokeWidth={3.5} aria-hidden />
                        </span>
                      )}
                    </RadioGroupPrimitive.Item>
                  );
                })}
              </ChoiceGroup>

              <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-surface-tint text-text-primary">
                    <AlarmClock className="size-[18px]" aria-hidden />
                  </span>
                  <div>
                    <Label htmlFor="reminder" className="text-[15px] font-normal">
                      {t("signRemind")}
                    </Label>
                    <p className="text-xs leading-4 text-text-secondary">{t("signByEmail")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex h-[26px] items-center gap-1 rounded-[8px] border border-line-panel bg-surface-page px-2 font-display text-xs font-medium text-text-primary focus-within:ring-2 focus-within:ring-ring">
                    <span className="sr-only">{t("signReminderTime")}</span>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="appearance-none bg-transparent outline-none"
                    >
                      {Array.from({ length: 34 }, (_, i) => {
                        const m = 6 * 60 + i * 30;
                        const slot = `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 ? "30" : "00"}`;
                        return <option key={slot}>{slot}</option>;
                      })}
                    </select>
                    <Clock className="size-3" aria-hidden />
                  </label>
                  <Switch id="reminder" checked={reminder} onCheckedChange={setReminder} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pinned dock */}
        <div className="mt-auto flex flex-col items-center gap-3 pt-6 md:pt-10">
          {step === "start" && (
            <>
              <SocialButton provider="Google" onError={setEmailError} />
              <SocialButton provider="Facebook" onError={setEmailError} />
              <PrimaryButton onClick={() => setStep("email")}>
                <Mail className="size-4" aria-hidden />
                {t("signContinueEmail")}
              </PrimaryButton>
              {emailError && (
                <p role="alert" className="text-center text-sm text-error">
                  {emailError}
                </p>
              )}
              <p className="pt-1 text-center text-xs leading-[18px] text-text-secondary">
                {t("signAgree")}{" "}
                <Link href="/terms" className="underline underline-offset-2">{t("terms")}</Link> {t("signAnd")}{" "}
                <Link href="/privacy" className="underline underline-offset-2">{t("signPrivacyPolicy")}</Link>.
              </p>
              <p className="text-sm text-text-primary">
                {t("signHaveAccount")}{" "}
                <a href="#" className="font-semibold text-text-accent md:font-bold md:text-text-primary md:underline md:underline-offset-2">{t("signLogIn")}</a>
              </p>
            </>
          )}

          {step === "email" && (
            <form onSubmit={submitEmail} noValidate className="flex w-full flex-col gap-3 md:rounded-2xl md:bg-surface-tint md:p-6">
              <label className="flex h-[52px] items-center gap-3 rounded-[12px] border border-line bg-white px-4 focus-within:ring-2 focus-within:ring-brand-primary/30 md:border-0">
                <Mail className="size-4 text-icon-default" aria-hidden />
                <span className="sr-only">{t("email")}</span>
                <input
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary"
                />
                {email ? (
                  <button
                    type="button"
                    aria-label="Clear"
                    onClick={() => setEmail("")}
                    className="flex size-6 items-center justify-center rounded-full text-text-secondary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring md:hidden"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                ) : null}
              </label>
              {emailError && (
                <p id="email-error" role="alert" className="text-sm text-error">
                  {emailError}
                </p>
              )}
              <PrimaryButton type="submit" className="font-bold" disabled={sending}>
                {sending ? t("signSending") : t("signSendLink")}
                <ArrowRight className="size-4" aria-hidden />
              </PrimaryButton>
              <button
                type="button"
                onClick={() => setStep("start")}
                className="mx-auto flex items-center gap-1 rounded-sm px-2 py-1.5 font-display text-sm text-text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                {t("signOtherOptions")}
              </button>
              <p className="text-center text-sm text-text-secondary md:hidden">{t("signNoPassword")}</p>
            </form>
          )}

          {step === "sent" && (
            <>
              <a
                href={email ? `mailto:${email}` : "mailto:"}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] border border-line bg-white font-display text-[15px] font-semibold text-text-primary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              >
                <Mail className="size-4" aria-hidden />
                {t("signOpenEmail")}
              </a>
              <div className="flex items-center justify-center gap-2 md:flex-col md:gap-3">
                <button
                  type="button"
                  onClick={resendLink}
                  disabled={sending}
                  className="flex items-center gap-1.5 rounded-sm font-display text-sm font-semibold text-text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 md:font-medium md:text-text-primary"
                >
                  <RotateCw className="hidden size-3.5 md:block" aria-hidden />
                  {resent ? t("signResent") : t("signResend")}
                </button>
                <span aria-hidden className="text-text-secondary md:hidden">·</span>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="rounded-sm font-display text-sm text-text-secondary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring md:underline md:underline-offset-2"
                >
                  {t("signDifferentEmail")}
                </button>
              </div>
              {emailError && (
                <p role="alert" className="text-sm text-error">
                  {emailError}
                </p>
              )}
            </>
          )}

          {step === "goal" && (
            <>
              <PrimaryButton onClick={saveGoal} disabled={saving}>
                {saving ? t("saving") : t("signStartNext")}
                <ArrowRight className="size-4" aria-hidden />
              </PrimaryButton>
              {emailError && (
                <p role="alert" className="text-sm text-error">
                  {emailError}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HanaSays({ label, children }: { label?: boolean | "mobile"; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Avatar src={characters.hana.avatar} alt="Hana" size={40} />
      <div className="flex min-w-0 flex-col gap-1.5">
        {label ? (
          <span
            className={cn(
              "font-display text-xs leading-4 font-bold tracking-[0.6px] text-text-secondary",
              label === "mobile" && "md:hidden"
            )}
          >
            HANA
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/** Learner's answer bubble (sky tone with border), right-aligned. */
function SentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <span className="rounded-[14px] border border-draft-line bg-surface-tint px-5 py-3 text-[15px] leading-6 text-ink">
        {children}
      </span>
    </div>
  );
}

function PrimaryButton({ children, className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-brand-primary font-display text-[15px] font-medium text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
}

function SocialButton({
  provider,
  onError,
}: {
  provider: "Google" | "Facebook";
  onError: (message: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const { t } = useLocale();

  const signIn = async () => {
    setPending(true);
    onError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === "Google" ? "google" : "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === "Facebook" ? "public_profile email" : undefined,
      },
    });
    if (error) {
      setPending(false);
      onError(error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={pending}
      className="flex h-[52px] w-full items-center justify-center gap-3 rounded-[12px] border border-line bg-white font-display text-[15px] font-medium text-text-primary outline-none hover:bg-surface-page focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 md:border-0 md:font-normal md:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      {provider === "Google" ? <GoogleIcon /> : <FacebookIcon />}
      {pending ? t("signOpening", { provider }) : t("signContinueWith", { provider })}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.95l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path fill="#fff" d="M15.12 15.47 15.6 12.4h-2.94v-2c0-.84.41-1.66 1.73-1.66h1.34V6.13s-1.22-.21-2.38-.21c-2.43 0-4.02 1.47-4.02 4.14v2.34H6.66v3.07h2.67V24h3.33v-8.53h2.46Z" />
    </svg>
  );
}
