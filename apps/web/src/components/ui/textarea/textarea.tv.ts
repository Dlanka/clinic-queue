import { tv } from "tailwind-variants";

export const textareaStyles = tv({
  base: "w-full rounded-md border-[1.5px] border-neutral-variant-80 bg-neutral-30 px-3.5 py-2.5 text-sm font-medium text-neutral-95 outline-none transition-all placeholder:text-neutral-70 focus:border-primary focus:bg-neutral-40 focus:ring-2 focus:ring-primary/30",
  variants: {
    invalid: {
      true: "border-danger ring-danger/30 focus:border-danger focus:ring-danger/35",
      false: ""
    }
  },
  defaultVariants: {
    invalid: false
  }
});
