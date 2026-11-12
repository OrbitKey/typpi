"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PhrasesView } from "@/components/phrases/phrases-view";

/** D-PHR-01 · Phrases — `?empty=1` shows D-PHR-02 (nothing studied yet). */
export default function PhrasesPage() {
  return (
    <Suspense>
      <Phrases />
    </Suspense>
  );
}

function Phrases() {
  const empty = useSearchParams().get("empty") === "1";
  return <PhrasesView empty={empty} />;
}
