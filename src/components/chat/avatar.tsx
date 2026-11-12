import Image from "next/image";

import { cn } from "@/lib/utils";

/** Round (or rounded-square) avatar. Falls back to initials without `src`. */
export function Avatar({
  src,
  alt = "",
  size,
  shape = "circle",
  className,
  grayscale,
}: {
  src?: string;
  alt?: string;
  size: number;
  shape?: "circle" | "square";
  className?: string;
  grayscale?: boolean;
}) {
  const initials = alt
    .replace(/^(Dr|Mr|Ms|Mrs)\.\s*/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        shape === "circle" ? "rounded-full" : "rounded-[12px]",
        !src && "bg-surface-tint font-display font-semibold text-text-secondary",
        grayscale && "grayscale",
        className
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-label={alt}>{initials}</span>
      )}
    </span>
  );
}
