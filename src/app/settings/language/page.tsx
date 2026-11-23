"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { LanguagePicker } from "@/components/onboarding/language-picker";
import { SettingsPage } from "@/components/settings/settings-nav";
import { isLocale } from "@/lib/i18n";
import { detectLanguage } from "@/lib/onboarding";
import { loadProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";

/** D-SET-03 · Language & learning — same list component as D-ONB-01. */
export default function LanguageSettings() {
  const [language, setLanguage] = useState("en");
  const [detected, setDetected] = useState("en");
  const [toast, setToast] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { setLocale, t } = useLocale();

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
    const previous = language;
    setLanguage(code);
    if (isLocale(code)) setLocale(code);
    if (!userId) return;
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ language: code }).eq("id", userId);
    if (error) {
      setLanguage(previous);
      if (isLocale(previous)) setLocale(previous);
      return;
    }
    setToast(true);
    window.setTimeout(() => setToast(false), 2000);
  };

  return (
    <SettingsPage
      title={t("languageTitle")}
      description={t("languageDescription")}
      width={640}
      back
    >
      <LanguagePicker label="Interface language" value={language} detected={detected} onChange={change} compact />
      <div aria-live="polite" className="flex h-[34px] justify-center">
        {toast && (
          <span className="flex items-center gap-1.5 rounded-full border border-success/25 bg-success-tint px-4 py-1.5 font-display text-sm font-medium text-success">
            <Check className="size-4" aria-hidden />
            {t("saved")}
          </span>
        )}
      </div>
    </SettingsPage>
  );
}
