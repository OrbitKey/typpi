import { characters, type CharacterId } from "@/lib/characters";

/* ----------------------------------------------------------------------------
 * Languages (D-ONB-01). `native` is shown bold, `english` as the hint.
 * `dir: "rtl"` rows (Urdu) are right-aligned.
 * ------------------------------------------------------------------------- */
export type Language = {
  code: string;
  native: string;
  english: string;
  dir?: "rtl";
};

export const languages: Language[] = [
  { code: "en", native: "English", english: "English" },
  { code: "vi", native: "Tiếng Việt", english: "Vietnamese" },
  { code: "id", native: "Bahasa Indonesia", english: "Indonesian" },
  { code: "ne", native: "नेपाली", english: "Nepali" },
  { code: "my", native: "မြန်မာ", english: "Burmese" },
  { code: "fil", native: "Filipino", english: "Filipino" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "ur", native: "اردو", english: "Urdu", dir: "rtl" },
  { code: "zh", native: "中文", english: "Chinese" },
  { code: "ko", native: "한국어", english: "Korean" },
  { code: "pt", native: "Português", english: "Portuguese" },
  { code: "es", native: "Español", english: "Spanish" },
  { code: "ru", native: "Русский", english: "Russian" },
  { code: "si", native: "සිංහල", english: "Sinhala" },
  { code: "mn", native: "Монгол", english: "Mongolian" },
];

/** Case- and diacritic-insensitive match on native + English name. */
export function normalise(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function filterLanguages(query: string) {
  const q = normalise(query);
  if (!q) return languages;
  return languages.filter(
    (l) => normalise(l.native).includes(q) || normalise(l.english).includes(q)
  );
}

/** Best guess from the browser language, falling back to English. */
export function detectLanguage(): string {
  if (typeof navigator === "undefined") return "en";
  const base = navigator.language?.split("-")[0];
  return languages.some((l) => l.code === base) ? base : "en";
}

/* ----------------------------------------------------------------------------
 * Purpose (D-ONB-02)
 * ------------------------------------------------------------------------- */
export type PurposeId = "work" | "daily";

export const purposes: {
  id: PurposeId;
  title: string;
  description: string;
  characters: CharacterId[];
  /** Character the first lesson is with */
  firstCharacter: CharacterId;
  /** TODO(copy): only the "work" lesson is designed (D-ONB-04). */
  firstLesson: string;
}[] = [
  {
    id: "work",
    title: "At work",
    description: "Tell your manager you'll be late",
    characters: ["yuki"],
    firstCharacter: "yuki",
    firstLesson: "First lesson: Running late · 3 min",
  },
  {
    id: "daily",
    title: "Daily life",
    description: "Talk to your landlord or doctor",
    characters: ["keiko", "drMori"],
    firstCharacter: "keiko",
    firstLesson: "First lesson: Reporting a repair · 3 min",
  },
];

/* ----------------------------------------------------------------------------
 * Typing level (D-ONB-03)
 * ------------------------------------------------------------------------- */
export type LevelId = "never" | "little" | "confident";

export const levels: {
  id: LevelId;
  title: string;
  description: string;
  /** Hana's reply on D-ONB-04. Only "never" is designed — others are TODO(copy). */
  reply: string;
}[] = [
  {
    id: "never",
    title: "Never",
    description: "I'll show you every key",
    reply: "No problem! We'll go letter by letter. Let's send your first message to",
  },
  {
    id: "little",
    title: "A little",
    description: "I'll help when you're stuck",
    reply: "Nice! I'll jump in when you're stuck. Let's send your first message to",
  },
  {
    id: "confident",
    title: "Confidently",
    description: "Less help, more speed",
    reply: "Great! Less help, more speed. Let's send your first message to",
  },
];

export function getCharacter(id: CharacterId) {
  return characters[id];
}
