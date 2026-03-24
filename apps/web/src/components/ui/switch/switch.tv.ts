import { tv } from "tailwind-variants";

export const switchStyles = tv({
  slots: {
    root: "inline-flex items-center gap-2.5",
    track: "relative h-6 w-11 rounded-full transition-all duration-200 outline-none focus:ring-2",
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
    },
    intent: {
      primary: { track: "focus:ring-primary/30" },
      info: { track: "focus:ring-info/30" },
      warning: { track: "focus:ring-warning/30" },
      danger: { track: "focus:ring-danger/30" },
      success: { track: "focus:ring-success/30" },
      secondary: { track: "focus:ring-neutral-70/30" }
    }
  },
  compoundVariants: [
    {
      checked: true,
      intent: "primary",
      class: {
        track:
          "bg-primary shadow-[0_0_12px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
      }
    },
    {
      checked: true,
      intent: "info",
      class: {
        track: "bg-info shadow-[0_0_12px_color-mix(in_srgb,var(--color-info)_30%,transparent)]"
      }
    },
    {
      checked: true,
      intent: "warning",
      class: {
        track:
          "bg-warning shadow-[0_0_12px_color-mix(in_srgb,var(--color-warning)_30%,transparent)]"
      }
    },
    {
      checked: true,
      intent: "danger",
      class: {
        track:
          "bg-danger shadow-[0_0_12px_color-mix(in_srgb,var(--color-danger)_30%,transparent)]"
      }
    },
    {
      checked: true,
      intent: "success",
      class: {
        track:
          "bg-success shadow-[0_0_12px_color-mix(in_srgb,var(--color-success)_30%,transparent)]"
      }
    },
    {
      checked: true,
      intent: "secondary",
      class: {
        track:
          "bg-neutral-70 shadow-[0_0_12px_color-mix(in_srgb,var(--color-neutral-70)_30%,transparent)]"
      }
    }
  ],
  defaultVariants: {
    checked: false,
    intent: "primary"
  }
});
