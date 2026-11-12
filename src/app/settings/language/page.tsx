"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { LanguagePicker } from "@/components/onboarding/language-picker";
import { SettingsPage } from "@/components/settings/settings-nav";
import { detectLanguage } from "@/lib/onboarding";

/** D-SET-03 · Language & learning — same list component as D-ONB-01. */
export default function LanguageSettings() {
  const [language, setLanguage] = useState("en");
  const [detected, setDetected] = useState("en");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only detection
    setDetected(detectLanguage());
  }, []);

  const change = (code: string) => {
    setLanguage(code);
    setToast(true);
    // TODO(backend): save to the profile
    window.setTimeout(() => setToast(false), 2000);
  };

  return (
    <SettingsPage
      title="Language"
      description="Choose the language for menus and buttons. Lessons stay in Japanese."
      width={640}
    >
      <LanguagePicker label="Interface language" value={language} detected={detected} onChange={change} compact />
      <div aria-live="polite" className="flex h-[34px] justify-center">
        {toast && (
          <span className="flex items-center gap-1.5 rounded-full border border-success/25 bg-success-tint px-4 py-1.5 font-display text-sm font-medium text-success">
            <Check className="size-4" aria-hidden />
            Saved
          </span>
        )}
      </div>
    </SettingsPage>
  );
}
