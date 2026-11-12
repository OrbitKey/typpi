import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[104px] w-full rounded-[12px] border border-line bg-white px-4 py-3 text-base text-text-primary shadow-xs outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
