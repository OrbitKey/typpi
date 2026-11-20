"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function StripeReturnInner() {
  const sessionId = useSearchParams().get("session_id");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId?.startsWith("cs_")) return;
    let ignore = false;
    (async () => {
      const response = await fetch("/api/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (ignore) return;
      if (!response.ok) {
        setError(body?.error || "Couldn't confirm the payment.");
        return;
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("session_id");
      url.searchParams.delete("plan");
      window.location.replace(url.pathname + url.search);
    })();
    return () => {
      ignore = true;
    };
  }, [sessionId]);

  if (!sessionId) return null;
  return (
    <p role={error ? "alert" : "status"} className={error ? "text-center text-sm text-error" : "text-center text-sm text-text-secondary"}>
      {error || "Confirming payment…"}
    </p>
  );
}

/** Confirms a Stripe Checkout return and reloads the page with the saved plan. */
export function StripeReturn() {
  return (
    <Suspense fallback={null}>
      <StripeReturnInner />
    </Suspense>
  );
}
