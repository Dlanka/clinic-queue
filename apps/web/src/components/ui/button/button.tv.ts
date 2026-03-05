import { tv } from "tailwind-variants";
import { classes } from "@/lib/classes";

export const buttonStyles = tv({
  base: classes(
    "inline-flex",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-full",
    "font-bold",
    "transition-all",
    "duration-200",
    "disabled:cursor-not-allowed",
    "disabled:bg-neutral-40",
    "disabled:text-neutral-70",
    "disabled:opacity-60",
    "disabled:shadow-none",
    "disabled:transform-none"
  ),
  variants: {
    intent: {
      primary: classes(
        "bg-linear-to-br",
        "from-primary",
        "to-primary-hover",
        "text-on-primary",
        "shadow-[0_4px_20px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]",
        "hover:-translate-y-0.5",
        "hover:brightness-110"
      ),
      secondary: classes(
        "border",
        "border-neutral-variant-80",
        "bg-neutral-30",
        "text-neutral-90",
        "hover:border-neutral-variant-70",
        "hover:bg-neutral-40",
        "hover:text-neutral-100"
      ),
      ghost: "bg-transparent text-primary hover:bg-primary-soft",
      danger: "bg-danger text-neutral-10 hover:bg-danger-hover"
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "h-12 px-6 text-base"
    }
  },
  defaultVariants: {
    intent: "primary",
    size: "md"
  }
});
