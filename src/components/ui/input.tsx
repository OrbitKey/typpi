import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-[12px] border border-line bg-white px-4 text-base text-text-primary shadow-xs transition-[color,box-shadow] outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 aria-invalid:border-error aria-invalid:ring-error/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
