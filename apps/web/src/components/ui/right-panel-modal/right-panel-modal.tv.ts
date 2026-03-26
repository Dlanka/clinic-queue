import { tv } from "tailwind-variants";

export const rightPanelModalStyles = tv({
  slots: {
    overlay: "fixed inset-0 z-40 bg-neutral-0/55 backdrop-blur-sm",
    panel:
      "fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col  bg-neutral-30 shadow-2xl",
    header:
      "relative border-b border-subtle p-5 px-6 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-danger/65 before:via-primary/65 before:to-info/65",
    headerTop: "flex items-start justify-between gap-3",
    heading: "flex min-w-0 items-start gap-3",
    iconWrap:
      "grid size-10 place-items-center rounded-md bg-primary-soft text-primary shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_28%,transparent)]",
    title: "text-lg font-bold text-neutral-95",
    description: "text-xs mt-0.5 text-neutral-70",
    body: "flex-1 overflow-y-auto px-6 py-5 text-neutral-90",
    footer: "flex justify-end gap-2 px-6 py-4 border-t border-subtle"
  },
  variants: {
    variant: {
      info: {
        iconWrap:
          "bg-info-soft text-info shadow-[0_0_20px_color-mix(in_srgb,var(--color-info)_28%,transparent)]",
        header: "bg-info-soft/30"
      },
      success: {
        iconWrap:
          "bg-success-soft text-success shadow-[0_0_20px_color-mix(in_srgb,var(--color-success)_28%,transparent)]",
        header: "bg-success-soft/30"
      },
      warning: {
        iconWrap:
          "bg-warning-soft text-warning shadow-[0_0_20px_color-mix(in_srgb,var(--color-warning)_28%,transparent)]",
        header: "bg-warning-soft/30"
      },
      danger: {
        iconWrap:
          "bg-danger-soft text-danger shadow-[0_0_20px_color-mix(in_srgb,var(--color-danger)_28%,transparent)]",
        header: "bg-danger-soft/30"
      }
    }
  },
  defaultVariants: {
    variant: "info"
  }
});
