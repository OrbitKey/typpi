import { createClient } from "@/lib/supabase/client";

export type LessonProgress = {
  lesson_id: string;
  stars: number;
  xp: number;
};

export async function loadLessonProgress() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as LessonProgress[];

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id, stars, xp")
    .eq("user_id", user.id);

  return (data ?? []) as LessonProgress[];
}
