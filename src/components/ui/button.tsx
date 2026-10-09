import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Translucent fill so secondary buttons stay visible on both the page and bg-secondary cards.
const fill = "bg-black/[0.05] hover:bg-black/[0.08] dark:bg-white/[0.1] dark:hover:bg-white/[0.14]"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal transition-[scale,background-color,color,opacity] duration-100 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary-fill text-white hover:bg-primary-fill/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-border bg-background text-foreground hover:bg-secondary",
        secondary: `text-foreground ${fill}`,
        // Deprecated alias kept until every call site is migrated; removed in the final task.
        glass: `text-foreground ${fill}`,
        ghost: "text-foreground hover:bg-black/[0.05] dark:hover:bg-white/[0.1]",
        plain: "text-primary underline-offset-4 hover:underline active:scale-100 active:opacity-60",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-10 px-5 text-[0.9375rem] has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3.5 text-[0.8125rem] has-[>svg]:px-3",
        lg: "h-12 px-7 text-[1.0625rem] has-[>svg]:px-6",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    compoundVariants: [
      { variant: ["plain", "link"], className: "h-auto gap-0.5 rounded-none px-0 has-[>svg]:px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
