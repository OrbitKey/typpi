"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { isLocale, translate, type Locale, type MessageKey } from "@/lib/i18n";
import { loadProfile } from "@/lib/profile";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const pinned = useRef(false);

  const setLocale = useCallback((next: Locale) => {
    pinned.current = true;
    setLocaleState(next);
    try {
      localStorage.setItem("typpi.locale", next);
    } catch {
      // storage unavailable
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    try {
      const stored = localStorage.getItem("typpi.locale");
      if (stored && isLocale(stored)) setLocaleState(stored);
    } catch {
      // storage unavailable
    }
    loadProfile().then((result) => {
      if (cancelled || pinned.current) return;
      const code = result?.profile.language;
      if (code && isLocale(code)) setLocaleState(code);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
