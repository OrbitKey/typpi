"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PathwayView } from "@/components/pathway/pathway-view";

/**
 * D-PTH-01 · Pathway — and D-PTH-02 with `?plan=free`
 * (shown after "Not now" on the paywall). TODO: read the plan from the user's account.
 */
export default function PathwayPage() {
  return (
    <Suspense>
      <Pathway />
    </Suspense>
  );
}

function Pathway() {
  const plan = useSearchParams().get("plan");
  return <PathwayView plan={plan === "free" ? "free" : "paid"} />;
}
