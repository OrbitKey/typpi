"use client";

import { useRouter } from "next/navigation";

import { GuideBubble, GuideLabel, UserBubble } from "@/components/chat/bubbles";
import { ChoiceGroup, LevelTile } from "@/components/onboarding/choice-cards";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";
import { levels, purposes, type LevelId } from "@/lib/onboarding";

/** D-ONB-03 · Level */
export default function LevelStep() {
  const router = useRouter();
  const { purpose, level, setLevel } = useOnboarding();
  const hana = characters.hana;
  const purposeTitle = purposes.find((p) => p.id === purpose)?.title;

  return (
    <OnboardingShell
      progress={2.5}
      stepLabel="Step 3 of 3"
      cta={<ContinueButton onClick={() => router.push("/onboarding/start")} />}
    >
      <ChatStack className="pb-8">
        <UserBubble>{purposeTitle}</UserBubble>
        <div className="flex flex-col gap-1">
          <GuideLabel name={hana.name} avatar={hana.avatar} />
          <GuideBubble tail="bl-4" className="max-w-[507px]">
            Have you typed Japanese before?
          </GuideBubble>
        </div>
      </ChatStack>

      <ChoiceGroup
        label="Have you typed Japanese before?"
        value={level}
        onValueChange={(v) => setLevel(v as LevelId)}
        className="flex gap-2 pb-8"
      >
        {levels.map((l) => (
          <LevelTile
            key={l.id}
            value={l.id}
            title={l.title}
            description={l.description}
            selected={level === l.id}
          />
        ))}
      </ChoiceGroup>
    </OnboardingShell>
  );
}
