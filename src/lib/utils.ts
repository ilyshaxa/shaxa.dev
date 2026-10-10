import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Register the custom type scale and radii from globals.css. Without this, tailwind-merge
// treats `text-body` as a text color and silently drops it next to `text-muted-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "title-1", "title-2", "headline", "body-lg", "body", "caption"],
      radius: ["chip", "tile"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
