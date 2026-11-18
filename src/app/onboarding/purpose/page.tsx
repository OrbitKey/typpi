"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Avatar } from "@/components/chat/avatar";
import { GuideBubble, GuideMessageGroup, UserBubble } from "@/components/chat/bubbles";
import { ChoiceGroup, OptionCard } from "@/components/onboarding/choice-cards";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { useOnboarding } from "@/components/onboarding/onboarding-context";
import { ChatStack, OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { characters } from "@/lib/characters";
import { languages, purposes, type PurposeId } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/client";

/** D-ONB-02 · Purpose */
export default function PurposeStep() {
  const router = useRouter();
  const { language, purpose, setPurpose, travelNotify, setTravelNotify } = useOnboarding();
  const [notifyError, setNotifyError] = useState("");
  const hana = characters.hana;
  const languageName = languages.find((l) => l.code === language)?.native ?? "English";

  const notify = async () => {
    if (travelNotify) return;
    setNotifyError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update({ travel_notify: true }).eq("id", user.id);
      if (error) {
        setNotifyError("Couldn't save that. Try again in a moment.");
        return;
      }
    }
    setTravelNotify(true);
  };

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

      <p className="flex flex-col items-center gap-1 py-2 pb-6 text-sm leading-[18px] text-muted-ink">
        <span className="flex items-center gap-1">
          Travel – coming soon
          <span aria-hidden className="px-1">
            ·
          </span>
          {travelNotify ? (
            <span className="font-medium text-text-primary">We'll notify you</span>
          ) : (
            <button
              type="button"
              onClick={notify}
              className="rounded-sm font-medium text-text-accent underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Notify me
            </button>
          )}
        </span>
        {notifyError ? (
          <span role="alert" className="text-center text-error">
            {notifyError}
          </span>
        ) : null}
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
