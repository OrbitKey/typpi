"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

/** Return from a magic link. Email links arrive with ?code=, dashboard links with #access_token=. */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = query.get("code");
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");

    const finish = async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        router.replace(error ? "/signup?error=auth" : "/signup");
        return;
      }
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        router.replace(error ? "/signup?error=auth" : "/signup");
        return;
      }
      router.replace("/signup?error=auth");
    };

    void finish();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white font-display text-sm text-text-secondary">
      Signing you in…
    </main>
  );
}
