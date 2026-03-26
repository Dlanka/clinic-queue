import { tv } from "tailwind-variants";

export const avatarStyles = tv({
  base: "grid place-items-center rounded-full text-neutral-0 font-bold select-none",
  variants: {
    size: {
      xs: "h-6 w-6 text-2xs",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-14 w-14 text-lg"
    },
    interactive: {
      true: "cursor-pointer transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
      false: ""
    }
  },
  defaultVariants: {
    size: "md",
    interactive: false
  }
});
