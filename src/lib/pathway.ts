import type { CharacterId } from "@/lib/characters";

/* Pathway content (D-PTH-01/02). Greeting, XP and stars are sample data. */
export type LessonStatus = "done" | "current" | "locked" | "upgrade";

export type PathLesson = {
  id: string;
  title: string;
  subtitle: string;
  /** Lessons 4–6 need a paid plan */
  paid?: boolean;
};

export const workLessons: PathLesson[] = [
  { id: "running-late", title: "Running late", subtitle: "Apologizing politely" },
  { id: "day-off", title: "Asking for a day off", subtitle: "Negotiating dates & requesting permissions" },
  // TODO(copy): subtitle for "Changing a shift" isn't in Figma
  { id: "changing-shift", title: "Changing a shift", subtitle: "Swapping shifts with a coworker" },
  { id: "calling-in-sick", title: "Calling in sick", subtitle: "Formal notification to manager", paid: true },
  { id: "asking-a-question", title: "Asking a question", subtitle: "Clarifying task instructions", paid: true },
  { id: "thanking-manager", title: "Thanking your manager", subtitle: "Appreciation & closing conversations", paid: true },
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
