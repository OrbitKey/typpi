"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Avatar } from "@/components/chat/avatar";
import { GuideBubble, GuideLabel, UserBubble } from "@/components/chat/bubbles";
import { useLocale } from "@/components/i18n/locale-provider";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";
import { levels, purposes } from "@/lib/onboarding";

/** D-ONB-04 · Start with Yuki */
export default function StartStep() {
  const router = useRouter();
  const { purpose, level } = useOnboarding();
  const { t } = useLocale();
  const hana = characters.hana;
  const p = purposes.find((x) => x.id === purpose) ?? purposes[0];
  const l = levels.find((x) => x.id === level) ?? levels[0];
  const partner = characters[p.firstCharacter];
  const purposeTitle = p.id === "daily" ? t("onbDailyLife") : t("onbAtWork");
  const levelTitle = {
    never: t("onbNever"),
    little: t("onbLittle"),
    confident: t("onbConfident"),
  }[l.id];
  const reply = {
    never: t("onbReplyNever"),
    little: t("onbReplyLittle"),
    confident: t("onbReplyConfident"),
  }[l.id];
  const role = p.id === "daily" ? t("onbRoleLandlord") : t("onbRoleManager");
  const firstLesson = p.id === "daily" ? t("onbFirstRepair") : t("onbFirstRunning");

  // Spec: focus moves to the CTA on entry.
  const ctaRef = useRef<HTMLButtonElement>(null);
  useEffect(() => ctaRef.current?.focus({ preventScroll: true }), []);

  return (
    <OnboardingShell
      progress={3}
      stepLabel={t("onbStep", { current: "3", total: "3" })}
      backHref="/onboarding/level"
      cta={
        <ContinueButton
          ref={ctaRef}
          label={t("onbStartWith", { name: partner.shortName })}
          onClick={() => router.push("/lesson")}
        />
      }
    >
      <ChatStack className="pb-8">
        <UserBubble className="max-md:px-4 max-md:py-2 max-md:text-[15px]">{purposeTitle}</UserBubble>
        <div className="flex flex-col gap-1">
          <GuideLabel name={hana.name} avatar={hana.avatar} />
          <GuideBubble tail="bl-4" className="max-w-[507px]">
            {t("onbTypedBefore")}
          </GuideBubble>
        </div>
        <UserBubble className="font-medium max-md:px-4 max-md:py-2 max-md:text-[15px]">{levelTitle}</UserBubble>
        <div className="flex flex-col gap-1">
          <GuideLabel name={hana.name} avatar={hana.avatar} />
          <GuideBubble tail="bl-4" className="max-w-[507px] pr-[62px]">
            {reply} <span className="font-semibold">{partner.shortName}</span>.
          </GuideBubble>
        </div>
      </ChatStack>

      <div className="pb-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between md:p-[25px]">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="rounded-full bg-line-soft shadow-xs">
              <Avatar src={partner.avatar} size={48} className="md:hidden" />
              <Avatar src={partner.avatar} size={56} className="hidden md:inline-flex" />
            </span>
            <div>
              <h3 className="text-[17px] leading-[21.25px] font-semibold text-ink">
                {partner.name}
              </h3>
              <p className="pt-0.5 text-sm leading-[21px] text-muted-ink">{role}</p>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-xl bg-surface-tint px-3 py-2.5 text-sm leading-[21px] font-medium text-muted-ink md:rounded-full md:bg-pill md:px-3 md:py-[5px] md:whitespace-nowrap">
            <MessageSquare className="size-4 shrink-0 text-text-accent md:hidden" aria-hidden />
            {firstLesson}
          </span>
        </div>
      </div>
    </OnboardingShell>
  );
}
