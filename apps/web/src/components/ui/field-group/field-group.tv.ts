import { tv } from "tailwind-variants";

export const fieldGroupStyles = tv({
  slots: {
    root: "flex flex-col w-full space-y-1.5",
    label: "text-3xs font-bold uppercase tracking-section text-neutral-70 inline-flex items-center",
    controller: "w-full space-y-0.5",
    hint: "text-2xs text-neutral-70/60 font-medium",
    error: "text-xs font-medium text-danger"
  }
});
