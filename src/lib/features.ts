import { createClient } from "@/lib/supabase/client";

export type FeatureIdea = {
  id: string;
  title: string;
  body: string;
  status: string | null;
  votes: number;
  createdAt: number;
};

type IdeaRow = {
  id: string;
  title: string;
  body: string | null;
  status: string | null;
  base_votes: number;
  created_at: string;
};

function toIdea(row: IdeaRow, voteCount: number): FeatureIdea {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    status: row.status,
    votes: row.base_votes + voteCount,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function loadFeatureBoard(): Promise<
  { ideas: FeatureIdea[]; voted: string[] } | { error: string }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to see ideas." };

  const [ideasRes, votesRes] = await Promise.all([
    supabase.from("feature_ideas").select("id, title, body, status, base_votes, created_at"),
    supabase.from("feature_votes").select("idea_id, user_id"),
  ]);
  if (ideasRes.error || votesRes.error) return { error: "Couldn't load ideas." };

  const votes = votesRes.data ?? [];
  const ideas = ((ideasRes.data ?? []) as IdeaRow[]).map((row) =>
    toIdea(
      row,
      votes.filter((vote) => vote.idea_id === row.id).length
    )
  );
  const voted = votes.filter((vote) => vote.user_id === user.id).map((vote) => vote.idea_id as string);
  return { ideas, voted };
}

export async function setFeatureVote(ideaId: string, voted: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const query = voted
    ? supabase.from("feature_votes").upsert(
        { user_id: user.id, idea_id: ideaId },
        { onConflict: "user_id,idea_id" }
      )
    : supabase.from("feature_votes").delete().eq("user_id", user.id).eq("idea_id", ideaId);
  const { error } = await query;
  return !error;
}

export async function createFeature(title: string, body: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("feature_ideas")
    .insert({ title, body: body || null })
    .select("id, title, body, status, base_votes, created_at")
    .single();
  if (error || !data) return null;

  const vote = await supabase.from("feature_votes").insert({ user_id: user.id, idea_id: data.id });
  if (vote.error) return null;
  return toIdea(data as IdeaRow, 1);
}
