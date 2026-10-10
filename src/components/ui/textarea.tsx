import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-chip bg-black/[0.05] px-4 py-3 text-body text-foreground outline-none transition-[box-shadow] placeholder:text-foreground/70 dark:bg-white/[0.08]",
        "focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-destructive contrast-more:border contrast-more:border-foreground/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
