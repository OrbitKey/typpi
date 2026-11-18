import { createClient } from "@/lib/supabase/client";

export type Profile = {
  display_name: string | null;
  email: string | null;
  language: string;
  plan: string;
};

export async function loadProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("display_name, email, language, plan")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: data?.email ?? user.email ?? "",
    profile: (data ?? {
      display_name: null,
      email: user.email ?? null,
      language: "en",
      plan: "free",
    }) as Profile,
  };
}

export function planLabel(plan: string | null | undefined) {
  if (plan === "individual") return "Individual";
  if (plan === "premium") return "Premium";
  return "Free plan";
}

export function profileInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "?";
  return source.charAt(0).toUpperCase();
}
