/* ----------------------------------------------------------------------------
 * Lesson content + romaji helpers for the chat lesson (section 02).
 * One scenario is designed in Figma: "Running late" with Yuki Tanaka.
 * ------------------------------------------------------------------------- */

/** A piece of Japanese text, optionally with a furigana reading. */
export type RubySegment = { text: string; ruby?: string };
/** A line of a character message. */
export type RubyLine = RubySegment[];

export type Syllable = { kana: string; romaji: string };

export type KanjiOption = {
  kanji: string;
  meaning: string;
  correct: boolean;
  /** Why it's wrong (shown in the error line) */
  why?: string;
};

export const runningLate = {
  unit: "UNIT 2",
  unitTitle: "Talking to your boss",
  scenarioProgress: "Scenario 1 of 4 completed",
  step: 2,
  totalSteps: 6,
  xp: 340,

  timestamp: "Today · 09:42 AM",
  sentAt: "09:43 AM",

  incoming: {
    lines: [
      [{ text: "おはようございます。" }],
      [
        { text: "今日", ruby: "きょう" },
        { text: "は" },
        { text: "何時", ruby: "なんじ" },
        { text: "に" },
        { text: "来", ruby: "き" },
        { text: "ますか？" },
      ],
    ] as RubyLine[],
    romaji: "Ohayō gozaimasu. Kyō wa nanji ni kimasu ka?",
    translation: "Good morning. What time are you coming today?",
  },

  task: {
    goal: "Tell Tanaka-san you will be 10 minutes late.",
    glossary: [
      { ja: "10分", en: "10 minutes" },
      { ja: "おくれます", en: "to be late" },
    ],
    xp: 10,
    hintCost: 2,
    maxHints: 3,
  },

  /** Already-written part of the answer */
  prefix: "10分",
  /** What the learner types, syllable by syllable */
  syllables: [
    { kana: "お", romaji: "o" },
    { kana: "く", romaji: "ku" },
    { kana: "れ", romaji: "re" },
    { kana: "ま", romaji: "ma" },
    { kana: "す", romaji: "su" },
  ] as Syllable[],
  suffix: "。",
  /** Kana that gets converted to kanji */
  kana: "おくれます",
  kanjiOptions: [
    { kanji: "遅れます", meaning: "to be late", correct: true },
    {
      kanji: "送れます",
      meaning: "can send",
      correct: false,
      why: "送れます means “can send”. Late is 遅れます.",
    },
    {
      kanji: "後れます",
      meaning: "to fall behind",
      correct: false,
      why: "後れます means “to fall behind”. Late is 遅れます.",
    },
  ] as KanjiOption[],

  feedback: {
    stamp: ["よく", "できた"],
    message: "Natural and polite. Well done.",
  },

  reply: {
    lines: [
      [
        { text: "わかりました。" },
        { text: "気", ruby: "き" },
        { text: "をつけてください。" },
      ],
    ] as RubyLine[],
    romaji: "Wakarimashita. Ki o tsukete kudasai.",
    translation: "Got it. Come safely.",
  },

  cultureTip:
    "In Japan, message your manager before your shift starts if you'll be late.",
};

export type Lesson = typeof runningLate;

/* ----------------------------------------------------------------------------
 * Romaji → hiragana (enough to name a wrong key, e.g. "ri" → り)
 * ------------------------------------------------------------------------- */
const gojuon: Record<string, string> = {
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  sa: "さ", shi: "し", si: "し", su: "す", se: "せ", so: "そ",
  ta: "た", chi: "ち", ti: "ち", tsu: "つ", tu: "つ", te: "て", to: "と",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", hu: "ふ", he: "へ", ho: "ほ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を", n: "ん",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  za: "ざ", ji: "じ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  da: "だ", de: "で", do: "ど",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
};

export function toKana(romaji: string) {
  return gojuon[romaji.toLowerCase()];
}

/** Hiragana shown on the vowel keys of the on-screen keyboard. */
export const vowelKana: Record<string, string> = {
  A: "あ",
  I: "い",
  U: "う",
  E: "え",
  O: "お",
};
