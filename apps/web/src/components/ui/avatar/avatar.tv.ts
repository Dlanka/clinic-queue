import { tv } from "tailwind-variants";

export const avatarStyles = tv({
  base: "grid place-items-center rounded-md bg-linear-to-br from-primary to-tertiary text-neutral-0 font-bold",
  variants: {
    size: {
      sm: "h-8 w-8 text-xs",
      md: "h-9 w-9 text-sm",
      lg: "h-10 w-10 text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
});
