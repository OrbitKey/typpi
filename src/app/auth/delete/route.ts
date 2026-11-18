import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/** Deletes the signed-in user. The secret key stays on the server. */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    return NextResponse.json({ error: "Account deletion is not configured" }, { status: 500 });
  }

  const removed = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: "DELETE",
    headers: {
      apikey: secret,
      Authorization: `Bearer ${secret}`,
    },
  });
  if (!removed.ok) {
    return NextResponse.json({ error: "Could not delete the account" }, { status: 500 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
