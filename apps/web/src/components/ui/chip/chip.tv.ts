// import { tv } from "tailwind-variants";

import { tv } from "tailwind-variants";

export const chipStyles = tv({
  slots: {
    root: "inline-flex items-center rounded-full font-bold gap-2 text-xs leading-tight ",
    dot: "h-1.5 w-1.5 rounded-full"
  },
  variants: {
    size: {
      sm: {
        root: "px-2.5 py-1"
      },
      md: {
        root: "px-3.5 py-1.5"
      },
      lg: {
        root: "px-4 py-2"
      }
    },
    tone: {
      tertiary: {
        root: "bg-tertiary-soft text-tertiary",
        dot: "bg-tertiary"
      },
      success: {
        root: "bg-success-soft text-success",
        dot: "bg-success"
      },
      neutral: {
        root: "bg-neutral-40 text-neutral-95",
        dot: "bg-neutral-95"
      }
    }
  },
  defaultVariants: {
    size: "md",
    tone: "neutral"
  }
});
