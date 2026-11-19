"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  detectLanguage,
  type LevelId,
  type PurposeId,
} from "@/lib/onboarding";

type OnboardingState = {
  /** Language Hana uses to guide lessons */
  language: string;
  detectedLanguage: string;
  purpose: PurposeId;
  level: LevelId;
  /** Wants an email when the Travel track opens. No mail is sent yet. */
  travelNotify: boolean;
};

type OnboardingContextValue = OnboardingState & {
  setLanguage: (code: string) => void;
  setPurpose: (id: PurposeId) => void;
  setLevel: (id: LevelId) => void;
  setTravelNotify: (value: boolean) => void;
};

const STORAGE_KEY = "typpi.onboarding";

/* Daily life is the default purpose. Travel notify is only a saved flag. */
const defaults: OnboardingState = {
  language: "en",
  detectedLanguage: "en",
  purpose: "daily",
  level: "never",
  travelNotify: false,
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(defaults);

  // Restore after a refresh and detect the browser language (client only).
  useEffect(() => {
    let saved: Partial<OnboardingState> = {};
    try {
      saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      // storage unavailable — keep defaults
    }
    const detected = detectLanguage();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from browser-only APIs
    setState((s) => ({
      ...s,
      language: detected,
      ...saved,
      detectedLanguage: detected,
    }));
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      ...state,
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      setPurpose: (purpose) => setState((s) => ({ ...s, purpose })),
      setLevel: (level) => setState((s) => ({ ...s, level })),
      setTravelNotify: (travelNotify) => setState((s) => ({ ...s, travelNotify })),
    }),
    [state]
  );

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return ctx;
}
