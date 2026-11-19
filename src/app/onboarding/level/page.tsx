"use client";

import { useRouter } from "next/navigation";

import { GuideBubble, GuideLabel, UserBubble } from "@/components/chat/bubbles";
import { useLocale } from "@/components/i18n/locale-provider";
import { ChoiceGroup, LevelTile } from "@/components/onboarding/choice-cards";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";
import { levels, type LevelId } from "@/lib/onboarding";

/** D-ONB-03 · Level */
export default function LevelStep() {
  const router = useRouter();
  const { purpose, level, setLevel } = useOnboarding();
  const { t } = useLocale();
  const hana = characters.hana;
  const purposeTitle = purpose === "daily" ? t("onbDailyLife") : t("onbAtWork");
  const levelCopy = {
    never: { title: t("onbNever"), description: t("onbNeverDesc") },
    little: { title: t("onbLittle"), description: t("onbLittleDesc") },
    confident: { title: t("onbConfident"), description: t("onbConfidentDesc") },
  } as const;

  return (
    <OnboardingShell
      progress={2.5}
      stepLabel={t("onbStep", { current: "3", total: "3" })}
      cta={<ContinueButton onClick={() => router.push("/onboarding/start")} />}
    >
      <ChatStack className="pb-8">
        <UserBubble>{purposeTitle}</UserBubble>
        <div className="flex flex-col gap-1">
          <GuideLabel name={hana.name} avatar={hana.avatar} />
          <GuideBubble tail="bl-4" className="max-w-[507px]">
            {t("onbTypedBefore")}
          </GuideBubble>
        </div>
      </ChatStack>

      <ChoiceGroup
        label={t("onbTypedBefore")}
        value={level}
        onValueChange={(v) => setLevel(v as LevelId)}
        className="flex gap-2 pb-8"
      >
        {levels.map((l) => (
          <LevelTile
            key={l.id}
            value={l.id}
            title={levelCopy[l.id].title}
            description={levelCopy[l.id].description}
            selected={level === l.id}
          />
        ))}
      </ChoiceGroup>
    </OnboardingShell>
  );
}
