import { Star } from "lucide-react";

/** Star rating: filled = action/accent, empty = brand/neutral outline (3:1). */
export function Stars({ value, max = 3, size = 16 }: { value: number; max?: number; size?: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`Rating: ${value} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          style={{ width: size, height: size }}
          className={i < value ? "fill-action-accent text-action-accent" : "fill-[#8c95a3]/50 text-[#8c95a3]"}
          strokeWidth={1.75}
        />
      ))}
    </span>
  );
}
