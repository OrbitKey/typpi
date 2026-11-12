"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Avatar } from "@/components/chat/avatar";
import { GuideBubble, GuideLabel, UserBubble } from "@/components/chat/bubbles";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";
import { levels, purposes } from "@/lib/onboarding";

/** D-ONB-04 · Start with Yuki */
export default function StartStep() {
  const router = useRouter();
  const { purpose, level } = useOnboarding();
  const hana = characters.hana;
  const p = purposes.find((x) => x.id === purpose) ?? purposes[0];
  const l = levels.find((x) => x.id === level) ?? levels[0];
  const partner = characters[p.firstCharacter];

  // Spec: focus moves to the CTA on entry.
  const ctaRef = useRef<HTMLButtonElement>(null);
  useEffect(() => ctaRef.current?.focus({ preventScroll: true }), []);

  return (
    <OnboardingShell
      progress={3}
      stepLabel="Step 3 of 3"
      cta={
        <ContinueButton
          ref={ctaRef}
          label={`Start chatting with ${partner.shortName}`}
          onClick={() => router.push("/lesson")}
        />
      }
    >
      <ChatStack className="pb-8">
        <UserBubble>{p.title}</UserBubble>
        <div className="flex flex-col gap-1">
          <GuideLabel name={hana.name} avatar={hana.avatar} />
          <GuideBubble tail="bl-4" className="max-w-[507px]">
            Have you typed Japanese before?
          </GuideBubble>
        </div>
        <UserBubble className="font-medium">{l.title}</UserBubble>
        <div className="flex flex-col gap-1">
          <GuideLabel name={hana.name} avatar={hana.avatar} />
          <GuideBubble tail="bl-4" className="max-w-[507px] pr-[62px]">
            {l.reply} <span className="font-semibold">{partner.shortName}</span>.
          </GuideBubble>
        </div>
      </ChatStack>

      <div className="pb-8">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-[25px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-line-soft shadow-xs">
              <Avatar src={partner.avatar} size={56} />
            </span>
            <div>
              <h3 className="text-[17px] leading-[21.25px] font-semibold text-ink">
                {partner.name}
              </h3>
              <p className="pt-0.5 text-sm leading-[21px] text-muted-ink">{partner.role}</p>
            </div>
          </div>
          <span className="rounded-full bg-pill px-3 py-[5px] text-sm leading-[21px] font-medium whitespace-nowrap text-muted-ink">
            {p.firstLesson}
          </span>
        </div>
      </div>
    </OnboardingShell>
  );
}
