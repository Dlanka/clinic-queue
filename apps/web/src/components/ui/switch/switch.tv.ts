import { tv } from "tailwind-variants";

export const switchStyles = tv({
  slots: {
    root: "inline-flex items-center gap-2.5",
    track:
      "relative h-6 w-11 rounded-full transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30",
    thumb:
      "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-neutral-100 shadow transition-transform duration-200",
    label: "text-sm font-semibold text-neutral-95"
  },
  variants: {
    checked: {
      true: {
        track:
          "bg-primary shadow-[0_0_12px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]",
        thumb: "translate-x-5"
      },
      false: {
        track: "bg-neutral-40",
        thumb: "translate-x-0"
      }
    }
  },
  defaultVariants: {
    checked: false
  }
});
