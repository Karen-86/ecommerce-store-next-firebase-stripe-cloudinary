"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // default: "bg-transparent",
        // outline: "border border-input bg-transparent hover:bg-muted",

        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // destructive:
        //   "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        outlineDanger:
          "border border-red-100 bg-background shadow-xs hover:bg-red-50 text-red-400 hover:text-red-400 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost: "hover:bg-primary/5 text-primary dark:hover:bg-primary/5",
        ghostDanger: "text-red-500 hover:bg-red-50 dark:hover:bg-red/50",
        ghostStrong: "hover:bg-black/4 hover:text-accent-foreground dark:hover:bg-accent/50",
        ghostSecondary: "text-black/50 hover:bg-black/4 hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white shadow-xs hover:bg-green-600/90", // custom added
        dark: "bg-black/90 text-white shadow-xs hover:bg-primary duration-300", // custom added
        light: "bg-white/90 text-black/90 shadow-xs hover:bg-white/80 duration-300", // custom added
      },
      size: {
        // default:
        //   "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        // sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        // lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",

        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        xs: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        // xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-11 rounded-md px-12 has-[>svg]:px-9  has-[>svg:first-child]:pl-6.5",
        xl: "h-13 rounded-md px-12 has-[>svg]:px-9",
        icon: "size-9",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root data-slot="toggle" className={cn(toggleVariants({ variant, size, className }))} {...props} />
  );
}

export { Toggle, toggleVariants };
