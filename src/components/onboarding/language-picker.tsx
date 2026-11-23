"use client";

import { Check, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { useLocale } from "@/components/i18n/locale-provider";
import { filterLanguages, languages, type Language } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

/**
 * Language picker (D-ONB-01 + stress tests ST-01…04).
 * - search filters on native + English name (case/diacritic-insensitive)
 * - only the list scrolls (overscroll contained); top/bottom fades as scroll hints
 * - list is a labelled listbox; arrow keys move the selection and keep it in view
 * - Enter in the search field selects the first result; Esc clears the search
 */
export function LanguagePicker({
  value,
  detected,
  onChange,
  onSubmit,
  label,
  compact = false,
}: {
  value: string;
  detected: string;
  onChange: (code: string) => void;
  /** Called on Enter when the selection is confirmed */
  onSubmit?: () => void;
  label: string;
  /** Settings variant (D-SET-03): smaller rows, plain check, list grows */
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const { t } = useLocale();
  const listRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ top: false, bottom: false });
  const listId = useId();

  // Detected language is pinned to the top of the list.
  const ordered = useMemo(() => {
    const pinned = languages.find((l) => l.code === detected);
    return pinned ? [pinned, ...languages.filter((l) => l !== pinned)] : languages;
  }, [detected]);

  const results = useMemo(() => {
    const matches = new Set(filterLanguages(query));
    return ordered.filter((l) => matches.has(l));
  }, [ordered, query]);

  const updateFades = () => {
    const el = listRef.current;
    if (!el) return;
    setScroll({
      top: el.scrollTop > 0,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
    });
  };

  useEffect(updateFades, [results]);

  // Keep the selected row visible when it changes via keyboard.
  useEffect(() => {
    const row = listRef.current?.querySelector<HTMLElement>(`[data-code="${value}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [value]);

  const move = (delta: number) => {
    if (!results.length) return;
    const index = results.findIndex((l) => l.code === value);
    const next = results[Math.min(Math.max(index + delta, 0), results.length - 1)];
    onChange(next.code);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (results[0]) onChange(results[0].code);
    } else if (e.key === "End") {
      e.preventDefault();
      if (results.length) onChange(results[results.length - 1].code);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSubmit?.();
    }
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
    } else if (e.key === "Enter" && results[0]) {
      e.preventDefault();
      onChange(results[0].code);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      listRef.current?.focus();
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-line bg-white shadow-xs", !compact && "md:h-[302px]")}>
      <label className="flex items-center gap-2.5 border-b border-line px-3 pt-3 pb-[13px]">
        <Search className="size-[15px] text-icon-default" strokeWidth={2.25} aria-hidden />
        <span className="sr-only">{t("searchLanguage")}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder={t("searchLanguage")}
          aria-controls={listId}
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-text-secondary [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`${listId}-${value}`}
        tabIndex={0}
        onKeyDown={onListKeyDown}
        onScroll={updateFades}
        className={cn(
          compact ? "max-h-none md:max-h-[440px]" : "md:h-[252px]",
          "overflow-y-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          !compact && "max-md:overflow-visible"
        )}
      >
        {results.map((lang, i) => (
          <LanguageRow
            key={lang.code}
            id={`${listId}-${lang.code}`}
            lang={lang}
            selected={lang.code === value}
            detected={lang.code === detected}
            first={i === 0}
            compact={compact}
            onSelect={() => onChange(lang.code)}
          />
        ))}

        {results.length === 0 && (
          <p className="flex h-full items-center justify-center px-6 text-center text-[13px] text-text-secondary">
            {t("noLanguage", { query })}
          </p>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {query ? `${results.length} ${results.length === 1 ? "language" : "languages"}` : ""}
      </p>

      {/* Scroll hints */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-[47.5px] h-8 bg-gradient-to-b from-white to-white/0 transition-opacity max-md:hidden",
          scroll.top ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-white/0 transition-opacity max-md:hidden",
          scroll.bottom ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

function LanguageRow({
  id,
  lang,
  selected,
  detected,
  first,
  compact,
  onSelect,
}: {
  id: string;
  lang: Language;
  selected: boolean;
  detected: boolean;
  first: boolean;
  compact?: boolean;
  onSelect: () => void;
}) {
  const { t } = useLocale();
  return (
    <div
      id={id}
      role="option"
      aria-selected={selected}
      data-code={lang.code}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center justify-between px-4 transition-colors",
        compact ? "h-12 [&_.lang-native]:text-[15px] [&_.lang-hint]:text-xs" : "h-14",
        !first && "border-t border-line",
        selected ? "bg-surface-tint" : "bg-white hover:bg-surface-page"
      )}
    >
      {detected ? (
        <span className="flex items-center gap-2 md:gap-3">
          <span className="lang-native text-[17px] leading-[25.5px] font-semibold text-ink">
            {lang.native}
          </span>
          <span className="text-sm text-text-secondary md:hidden">({t("detected")})</span>
          <span className="hidden rounded-full border border-line bg-white px-[9px] py-[3px] text-xs leading-[16.5px] font-semibold tracking-[0.275px] text-muted-ink uppercase md:inline">
            {t("detected")}
          </span>
        </span>
      ) : (
        <span
          className={cn("flex items-baseline gap-2 whitespace-nowrap", lang.dir === "rtl" && "items-center")}
        >
          <span
            dir={lang.dir ?? "auto"}
            lang={lang.code}
            className={cn("lang-native text-[17px] leading-[25.5px] text-ink", compact ? "font-medium" : "font-semibold")}
          >
            {lang.native}
          </span>
          <span className="lang-hint text-sm leading-[21px] text-muted-ink">
            {lang.dir === "rtl" ? `(${lang.english})` : lang.english}
          </span>
        </span>
      )}

      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          selected && !compact && "bg-brand-primary text-white",
          selected && compact && "bg-brand-primary text-white md:bg-transparent md:text-text-primary"
        )}
      >
        {selected && (
          <Check
            className={compact ? "size-3.5 text-white md:size-4 md:text-text-primary" : "size-[13px]"}
            strokeWidth={compact ? 3 : 3}
          />
        )}
      </span>
    </div>
  );
}
