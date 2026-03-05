import { tv } from "tailwind-variants";

export const checkboxStyles = tv({
  slots: {
    root: "flex items-start gap-2.5",
    input:
      "mt-0.5 h-5 w-5 rounded-md border-2 border-neutral-70 bg-transparent accent-primary outline-none transition-all focus:ring-2 focus:ring-primary/30",
    text: "text-sm font-semibold text-neutral-95",
    hint: "text-xs text-neutral-70"
  }
});
