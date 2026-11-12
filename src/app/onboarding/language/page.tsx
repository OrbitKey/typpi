"use client";

import { useRouter } from "next/navigation";

import { GuideBubble, GuideIdentity } from "@/components/chat/bubbles";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { LanguagePicker } from "@/components/onboarding/language-picker";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";

/** D-ONB-01 · Language */
export default function LanguageStep() {
  const router = useRouter();
  const { language, detectedLanguage, setLanguage } = useOnboarding();
  const next = () => router.push("/onboarding/purpose");

  return (
    <OnboardingShell
      progress={1}
      stepLabel="Step 1 of 3"
      cta={<ContinueButton onClick={next} />}
    >
      <ChatStack className="pb-8">
        <GuideIdentity name={characters.hana.name} avatar={characters.hana.avatar} />
        <GuideBubble>
          <span lang="ja">こんにちは！</span> I&apos;m Hana.{" "}
          <span lang="ja" className="font-medium text-ink-strong">
            一緒に、少しずつ
          </span>{" "}
          — a little at a time, together.
        </GuideBubble>
        <GuideBubble className="font-medium">
          Which language should I use to guide your lessons?
        </GuideBubble>
      </ChatStack>

      <div className="pb-8">
        <LanguagePicker
          label="Which language should I use to guide your lessons?"
          value={language}
          detected={detectedLanguage}
          onChange={setLanguage}
          onSubmit={next}
        />
      </div>
    </OnboardingShell>
  );
}
