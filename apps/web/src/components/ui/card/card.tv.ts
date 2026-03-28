import { tv, type VariantProps } from "tailwind-variants";

export const cardStyles = tv({
  slots: {
    root: "relative overflow-hidden rounded-xl bg-neutral-30 border border-subtle g-linear",
    header: "flex items-center gap-3 border-b border-subtle px-6 py-4",
    icon: "grid p-2 place-items-center rounded-md",
    title: "text-base font-bold text-neutral-90/90",
    subtitle: "text-xs text-neutral-90/60",
    action: "ml-auto",
    body: "p-6"
  },
  variants: {
    variant: {
      default: {
        root: "g-linear-primary"
      },
      success: {
        root: "g-linear-success"
      },
      error: {
        root: "g-linear-error"
      },
      warning: {
        root: "g-linear-warning"
      },
      info: {
        root: "g-linear-info"
      }
    }
  },

  defaultVariants: {
    variant: "default"
  }
});

export type CardVariant = VariantProps<typeof cardStyles>;
