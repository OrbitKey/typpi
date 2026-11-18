"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { LanguagePicker } from "@/components/onboarding/language-picker";
import { SettingsPage } from "@/components/settings/settings-nav";
import { detectLanguage } from "@/lib/onboarding";
import { loadProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";

/** D-SET-03 · Language & learning — same list component as D-ONB-01. */
export default function LanguageSettings() {
  const [language, setLanguage] = useState("en");
  const [detected, setDetected] = useState("en");
  const [toast, setToast] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only detection
    setDetected(detectLanguage());
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      setUserId(result.userId);
      if (result.profile.language) setLanguage(result.profile.language);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const change = async (code: string) => {
    setLanguage(code);
    if (!userId) return;
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ language: code }).eq("id", userId);
    if (error) return;
    setToast(true);
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
