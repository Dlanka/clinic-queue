import { tv } from "tailwind-variants";

export const inputStyles = tv({
  slots: {
    wrapper: "flex items-center gap-2 border bg-neutral-30 text-neutral-70 transition-all",
    input:
      "w-full border-none bg-transparent font-medium text-neutral-95 outline-none placeholder:text-neutral-70",
    icon: "shrink-0 text-neutral-70",
    endWrapper: "flex items-center gap-1",
    shortcut: "rounded bg-neutral-40 px-1.5 py-0.5 text-2xs font-bold leading-none text-neutral-90"
  },
  variants: {
    size: {
      sm: {
        wrapper: "h-9 px-3",
        input: "text-xs",
        icon: "size-3.5"
      },
      md: {
        wrapper: "h-10 px-3.5",
        input: "text-sm",
        icon: "size-4"
      },
      lg: {
        wrapper: "h-11 px-4",
        input: "text-base",
        icon: "size-5"
      }
    },
    rounded: {
      default: {
        wrapper: "rounded-md"
      },
      full: {
        wrapper: "rounded-full"
      }
    },
    invalid: {
      true: {
        wrapper:
          "border-danger focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/35"
      },
      false: {
        wrapper:
          "border-neutral-variant-80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
      }
    }
  },
  defaultVariants: {
    size: "md",
    rounded: "default",
    invalid: false
  }
});
