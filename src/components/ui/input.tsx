import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-chip bg-black/[0.05] px-4 text-body text-foreground outline-none transition-[box-shadow] placeholder:text-foreground/70 selection:bg-primary selection:text-white dark:bg-white/[0.08]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-destructive contrast-more:border contrast-more:border-foreground/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
