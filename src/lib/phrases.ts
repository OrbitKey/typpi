import type { RubyLine } from "@/lib/lesson";

/* Phrases studied so far (D-PHR-01) — sample data from lesson 1 "Running late". */
export type Phrase = { id: string; ja: RubyLine; en: string; section: string };

export const phraseGroups: { title: string; meta: string; phrases: Phrase[] }[] = [
  {
    title: "Running late",
    meta: "Work · Lesson 1",
    phrases: [
      { id: "p1", section: "Work", en: "Good morning.", ja: [{ text: "おはようございます。" }] },
      {
        id: "p2",
        section: "Work",
        en: "What time are you coming today?",
        ja: [
          { text: "今日", ruby: "きょう" },
          { text: "は" },
          { text: "何時", ruby: "なんじ" },
          { text: "に" },
          { text: "来", ruby: "き" },
          { text: "ますか？" },
        ],
      },
      {
        id: "p3",
        section: "Work",
        en: "I will be 10 minutes late.",
        ja: [{ text: "10分" }, { text: "遅", ruby: "おく" }, { text: "れます。" }],
      },
      {
        id: "p4",
        section: "Work",
        en: "Got it. Come safely.",
        ja: [
          { text: "わかりました。" },
          { text: "気", ruby: "き" },
          { text: "をつけてください。" },
        ],
      },
      { id: "p5", section: "Work", en: "To be late.", ja: [{ text: "遅", ruby: "おく" }, { text: "れます" }] },
    ],
  },
  {
    title: "Saved from culture tips",
    meta: "",
    phrases: [
      {
        id: "p6",
        section: "Work",
        en: "Prompt reporting: report early, before your manager has to ask.",
        ja: [{ text: "ホウレンソウ" }],
      },
    ],
  },
];
