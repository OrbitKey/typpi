import { LessonChat } from "@/components/lesson/lesson-chat";
import { runningLate } from "@/lib/lesson";

/** D-LSN-01…06 · Chat lesson ("Running late" with Yuki) */
export default function LessonPage() {
  return <LessonChat lesson={runningLate} />;
}
