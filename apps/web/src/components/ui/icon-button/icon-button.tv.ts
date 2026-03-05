import { tv } from "tailwind-variants";

export const iconButtonStyles = tv({
  base: "grid place-items-center rounded-md transition-colors cursor-pointer",
  variants: {
    size: {
      sm: "h-8 w-8",
      md: "h-9 w-9",
      lg: "h-10 w-10"
    },
    tone: {
      neutral: "text-neutral-90 hover:bg-neutral-40 hover:text-neutral-100",
      primary: "text-primary hover:bg-primary-soft",
      danger: "text-danger hover:bg-danger-soft"
    }
  },
  defaultVariants: {
    size: "md",
    tone: "neutral"
  }
});
