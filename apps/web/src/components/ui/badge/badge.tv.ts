import { tv } from "tailwind-variants";

export const badgeStyles = tv({
  base: "inline-flex items-center rounded-full font-bold",
  variants: {
    tone: {
      neutral: "bg-neutral-40 text-neutral-70",
      success: "bg-success-soft text-success",
      warning: "bg-warning-soft text-warning",
      danger: "bg-danger-soft text-danger",
      info: "bg-primary-soft text-primary"
    },
    size: {
      sm: "px-2 py-0.5 text-3xs",
      md: "px-2.5 py-1 text-2xs"
    },
    variant: {
      default: "uppercase tracking-[0.04em]",
      capitalize: "capitalize tracking-normal"
    }
  },
  defaultVariants: {
    tone: "neutral",
    size: "md",
    variant: "default"
  }
});
