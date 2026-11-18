import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function LegalDocument({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <article className="mx-auto flex w-full max-w-[640px] flex-col">
        <Link href="/signup" className="w-fit rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo size="medium" />
        </Link>
        <h1 className="pt-10 font-display text-[32px] leading-10 font-semibold tracking-[-0.4px] text-text-primary">
          {title}
        </h1>
        <p className="pt-2 text-sm text-text-secondary">Updated {updated}</p>
        <div className="flex flex-col gap-8 pt-8 text-[15px] leading-6 text-text-secondary">{children}</div>
        <p className="flex items-center gap-2 pt-12 text-sm text-text-secondary">
          <Link href="/terms" className="underline underline-offset-2 hover:text-text-primary">
            Terms
          </Link>
          <span aria-hidden>·</span>
          <Link href="/privacy" className="underline underline-offset-2 hover:text-text-primary">
            Privacy
          </Link>
        </p>
      </article>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-lg font-semibold text-text-primary">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
