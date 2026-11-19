"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PathwayView } from "@/components/pathway/pathway-view";
import { StripeReturn } from "@/components/plans/stripe-return";

/**
 * D-PTH-01 · Pathway — and D-PTH-02 with `?plan=free`
 * (shown after "Not now" on the paywall). The account plan is read inside PathwayView.
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
  return (
    <>
      <StripeReturn />
      <PathwayView plan={plan === "free" ? "free" : "paid"} />
    </>
  );
}
