import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        // The callback page exchanges ?code= itself. Leaving this on exchanges
        // the same code twice, and the second attempt looks like a failed login.
        detectSessionInUrl: false,
      },
    }
  );
}
