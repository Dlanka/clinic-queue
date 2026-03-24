import { tv } from "tailwind-variants";

export const radioChipGroupStyles = tv({
  slots: {
    root: "grid grid-cols-1 gap-2 sm:grid-cols-3",
    item: "justify-center",
    dot: "inline-flex size-2 rounded-full"
  }
});
