import type { CharacterId } from "@/lib/characters";

/* Pathway content (D-PTH-01/02). Greeting, XP and stars are sample data. */
export type LessonStatus = "done" | "current" | "locked" | "upgrade";

export type PathLesson = {
  title: string;
  subtitle: string;
  stars?: number;
  /** Lessons 4–6 need a paid plan */
  paid?: boolean;
};

export const workLessons: PathLesson[] = [
  { title: "Running late", subtitle: "Apologizing politely", stars: 2 },
  { title: "Asking for a day off", subtitle: "Negotiating dates & requesting permissions", stars: 3 },
  // TODO(copy): subtitle for "Changing a shift" isn't in Figma
  { title: "Changing a shift", subtitle: "Swapping shifts with a coworker", stars: 2 },
  { title: "Calling in sick", subtitle: "Formal notification to manager", paid: true },
  { title: "Asking a question", subtitle: "Clarifying task instructions", paid: true },
  { title: "Thanking your manager", subtitle: "Appreciation & closing conversations", paid: true },
];

export const lockedSections: {
  id: string;
  title: string;
  character: CharacterId;
  description: string;
  hint: string;
}[] = [
  { id: "home", title: "Home", character: "keiko", description: "Keiko Sato, your landlord", hint: "Finish Work to unlock" },
  { id: "health", title: "Health", character: "drMori", description: "Dr. Mori, your doctor", hint: "Locked" },
  { id: "coworkers", title: "Coworkers", character: "ren", description: "Ren Suzuki, your colleague", hint: "Locked" },
  { id: "city", title: "City life", character: "ito", description: "Mr. Ito, city hall clerk", hint: "Locked" },
];
