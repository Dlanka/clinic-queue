import { tv } from "tailwind-variants";

export const selectStyles = tv({
  slots: {
    root: "space-y-1.5",
    label: "text-2xs font-bold uppercase tracking-[0.08em] text-neutral-70",
    error: "text-xs font-medium text-danger"
  }
});
