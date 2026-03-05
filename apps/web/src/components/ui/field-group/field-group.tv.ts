import { tv } from "tailwind-variants";

export const fieldGroupStyles = tv({
  slots: {
    root: "space-y-1.5",
    label: "text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-70",
    hint: "text-xs text-neutral-70",
    error: "text-xs font-medium text-danger"
  }
});
