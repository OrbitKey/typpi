"use client";

import { ArrowRight, Inbox, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AppRail } from "@/components/app/app-rail";
import { RubyText } from "@/components/lesson/messages";
import { normalise } from "@/lib/onboarding";
import { phraseGroups } from "@/lib/phrases";
import { cn } from "@/lib/utils";

/** D-PHR-01 · Phrases and D-PHR-02 · Phrases (Empty) */
export function PhrasesView({ empty = false }: { empty?: boolean }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const groups = useMemo(() => (empty ? [] : phraseGroups), [empty]);
  const total = groups.reduce((n, g) => n + g.phrases.length, 0);
  const sections = ["All", ...new Set(groups.flatMap((g) => g.phrases.map((p) => p.section)))];

  const filtered = groups
    .map((g) => ({
      ...g,
      phrases: g.phrases.filter((p) => {
        if (filter !== "All" && p.section !== filter) return false;
        const q = normalise(query);
        if (!q) return true;
        const ja = p.ja.map((s) => s.text + (s.ruby ?? "")).join("");
        return normalise(p.en).includes(q) || ja.includes(query.trim());
      }),
    }))
    .filter((g) => g.phrases.length > 0);

  return (
    <div className="flex min-h-screen bg-white">
      <AppRail active="phrases" />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-8 py-8">
          <header>
            <h1 className="font-display text-2xl leading-8 font-semibold text-text-primary">Phrases</h1>
            <p className="text-sm leading-5 text-text-secondary">
              {total === 0
                ? "0 phrases"
                : `${total} phrases from the lessons you have completed`}
            </p>
          </header>

          {total === 0 ? (
            <div className="flex min-h-[560px] flex-col items-center justify-center gap-2 text-center">
              <Inbox className="size-9 text-icon-default" strokeWidth={1.5} aria-hidden />
              <h2 className="pt-3 font-display text-lg font-semibold text-text-primary">No phrases yet</h2>
              <p className="max-w-sm text-sm text-text-secondary">
                Finish a lesson and the phrases you studied will appear here.
              </p>
              <Link
                href="/pathway"
                className="mt-4 flex h-14 items-center gap-1.5 rounded-[14px] bg-brand-primary px-14 font-display text-[15px] font-medium text-white outline-none hover:bg-brand-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Go to Pathway
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <label className="flex h-12 items-center gap-2.5 rounded-[12px] border border-line bg-white px-4 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20">
                  <Search className="size-4 text-icon-default" aria-hidden />
                  <span className="sr-only">Search phrases</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search phrases"
                    className="w-full bg-transparent text-[15px] outline-none placeholder:text-text-secondary"
                  />
                </label>
                <div role="group" aria-label="Filter by section" className="flex gap-2">
                  {sections.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={filter === s}
                      onClick={() => setFilter(s)}
                      className={cn(
                        "h-9 rounded-full border px-4 font-display text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        filter === s
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-line bg-white text-text-primary hover:bg-surface-page"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <p aria-live="polite" className="sr-only">
                {filtered.reduce((n, g) => n + g.phrases.length, 0)} phrases
              </p>

              {filtered.length === 0 && (
                <p className="py-12 text-center text-sm text-text-secondary">No phrases match “{query}”.</p>
              )}

              {filtered.map((g) => (
                <section key={g.title} aria-labelledby={`g-${g.title}`} className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-2">
                    <h2 id={`g-${g.title}`} className="font-display text-base font-semibold text-text-primary">
                      {g.title}
                    </h2>
                    <span className="text-sm text-text-secondary">
                      {g.meta ? `${g.meta} · ` : ""}
                      {g.phrases.length} {g.phrases.length === 1 ? "phrase" : "phrases"}
                    </span>
                  </div>
                  <ul className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
                    {g.phrases.map((p) => (
                      <li key={p.id} className="flex flex-col gap-1 px-5 py-4">
                        <RubyText lines={[p.ja]} furigana />
                        <p className="text-sm leading-5 text-text-secondary">{p.en}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
