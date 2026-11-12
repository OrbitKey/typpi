"use client";

import { useRouter } from "next/navigation";

import { Avatar } from "@/components/chat/avatar";
import { GuideBubble, GuideMessageGroup, UserBubble } from "@/components/chat/bubbles";
import { ChoiceGroup, OptionCard } from "@/components/onboarding/choice-cards";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";
import { languages, purposes, type PurposeId } from "@/lib/onboarding";

/** D-ONB-02 · Purpose */
export default function PurposeStep() {
  const router = useRouter();
  const { language, purpose, setPurpose } = useOnboarding();
  const hana = characters.hana;
  const languageName = languages.find((l) => l.code === language)?.native ?? "English";

  return (
    <OnboardingShell
      progress={2}
      stepLabel="Step 2 of 3"
      cta={<ContinueButton onClick={() => router.push("/onboarding/level")} />}
    >
      <ChatStack className="pb-6">
        <GuideMessageGroup name={hana.name} avatar={hana.avatar} dimmed>
          <GuideBubble size="sm" tail="tl">
            Which language should I use to guide your lessons?
          </GuideBubble>
        </GuideMessageGroup>

        <UserBubble size="sm" tail="tr">
          {languageName}
        </UserBubble>

        <div className="pt-1">
          <GuideMessageGroup name={hana.name} avatar={hana.avatar}>
            <GuideBubble size="sm" tail="tl">
              What do you need Japanese for?
            </GuideBubble>
            <GuideBubble size="sm" tail="none">
              Pick one – you can add the other later.
            </GuideBubble>
          </GuideMessageGroup>
        </div>
      </ChatStack>

      <ChoiceGroup
        label="What do you need Japanese for?"
        value={purpose}
        onValueChange={(v) => setPurpose(v as PurposeId)}
        className="flex flex-col gap-4 pb-4"
      >
        {purposes.map((p) => (
          <OptionCard
            key={p.id}
            value={p.id}
            title={p.title}
            description={p.description}
            selected={purpose === p.id}
            media={<PurposeMedia id={p.id} />}
          />
        ))}
      </ChoiceGroup>

      <p className="flex items-center justify-center gap-1 py-2 pb-6 text-sm leading-[18px] text-muted-ink">
        Travel – coming soon
        <span aria-hidden className="px-1">
          ·
        </span>
        {/* TODO: hook up "notify me" (waitlist) */}
        <button
          type="button"
          className="rounded-sm font-medium text-text-accent underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Notify me
        </button>
      </p>
    </OnboardingShell>
  );
}

function PurposeMedia({ id }: { id: PurposeId }) {
  if (id === "work") {
    return (
      <span className="flex size-12 overflow-hidden rounded-[12px] border border-line-panel p-px shadow-xs">
        <Avatar src={characters.yuki.avatarSquare} size={46} shape="square" className="rounded-[11px]" />
      </span>
    );
  }
  // Keiko (top-left) overlapping Dr. Mori (bottom-right)
  return (
    <span className="relative block size-12">
      <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white shadow-xs">
        <Avatar src={characters.drMori.avatar} size={28} />
      </span>
      <span className="absolute top-0 left-0 flex size-8 items-center justify-center rounded-full border-2 border-white shadow-xs">
        <Avatar src={characters.keiko.avatar} size={28} />
      </span>
    </span>
  );
}
