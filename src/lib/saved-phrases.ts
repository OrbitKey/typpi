import { createClient } from "@/lib/supabase/client";

/** Culture tip on the Running late summary. */
export const cultureTipPhraseId = "p6";

export async function loadSavedPhraseIds() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as string[];

  const { data, error } = await supabase.from("saved_phrases").select("phrase_id").eq("user_id", user.id);
  if (error) return [] as string[];
  return (data ?? []).map((row) => row.phrase_id as string);
}

export async function setPhraseSaved(phraseId: string, saved: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const query = saved
    ? supabase.from("saved_phrases").upsert(
        { user_id: user.id, phrase_id: phraseId },
        { onConflict: "user_id,phrase_id" }
      )
    : supabase.from("saved_phrases").delete().eq("user_id", user.id).eq("phrase_id", phraseId);

  const { error } = await query;
  return !error;
}
