import { tv } from "tailwind-variants";

export const badgeStyles = tv({
  base: "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em]",
  variants: {
    tone: {
      neutral: "bg-neutral-40 text-neutral-95",
      success: "bg-success-soft text-success",
      warning: "bg-warning-soft text-warning",
      danger: "bg-danger-soft text-danger",
      info: "bg-primary-soft text-primary"
    }
  },
  defaultVariants: {
    tone: "neutral"
  }
});
