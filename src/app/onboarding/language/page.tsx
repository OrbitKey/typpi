"use client";

import { useRouter } from "next/navigation";

import { GuideBubble, GuideIdentity } from "@/components/chat/bubbles";
import { useLocale } from "@/components/i18n/locale-provider";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { LanguagePicker } from "@/components/onboarding/language-picker";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";

/** D-ONB-01 · Language */
export default function LanguageStep() {
  const router = useRouter();
  const { language, detectedLanguage, setLanguage } = useOnboarding();
  const { t } = useLocale();
  const next = () => router.push("/onboarding/purpose");

  return (
    <OnboardingShell
      progress={1}
      stepLabel={t("onbStep", { current: "1", total: "3" })}
      cta={<ContinueButton hideArrowOnMobile onClick={next} />}
    >
      <ChatStack className="pb-8">
        <GuideIdentity name={characters.hana.name} avatar={characters.hana.avatar} />
        <GuideBubble>
          <span lang="ja">こんにちは！</span> {t("onbImHana")}{" "}
          <span lang="ja" className="font-medium text-ink-strong">
            一緒に、少しずつ
          </span>{" "}
          — {t("onbTogether")}
        </GuideBubble>
        <GuideBubble className="font-medium">{t("onbWhichLanguage")}</GuideBubble>
      </ChatStack>

      <div className="pb-8">
        <LanguagePicker
          label={t("onbWhichLanguage")}
          value={language}
          detected={detectedLanguage}
          onChange={setLanguage}
          onSubmit={next}
        />
      </div>
    </OnboardingShell>
  );
}
