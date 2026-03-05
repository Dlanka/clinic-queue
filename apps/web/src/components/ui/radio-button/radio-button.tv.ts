import { tv } from "tailwind-variants";

export const radioButtonStyles = tv({
  slots: {
    root: "inline-flex",
    input: "peer sr-only",
    label:
      "cursor-pointer rounded-full border border-neutral-variant-80 bg-transparent px-4 py-1.5 text-sm font-bold text-neutral-90 transition-all peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary hover:border-neutral-variant-70 hover:text-neutral-95"
  }
});
