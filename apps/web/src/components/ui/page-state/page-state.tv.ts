import { tv } from "tailwind-variants";

export const pageStateStyles = tv({
  slots: {
    root: "relative overflow-hidden rounded-xl border border-subtle bg-linear-to-r from-neutral-20/80 via-neutral-10/95 to-neutral-20/80 p-6 md:p-10",
    fullPageWrap: "grid min-h-screen place-items-center bg-neutral-20 p-4 md:p-6",
    content: "relative mx-auto max-w-2xl space-y-4 text-center",
    glow: "absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--color-primary)_12%,transparent),transparent_42%)]",
    grid: "absolute inset-0 opacity-15 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-neutral-variant-90)_65%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-neutral-variant-90)_65%,transparent)_1px,transparent_1px)] bg-[size:60px_60px]",
    iconWrap: "mx-auto inline-grid h-20 w-20 place-items-center rounded-lg",
    badge: "mx-auto inline-flex",
    title: "text-2xl font-bold text-neutral-90",
    description: "mx-auto max-w-xl text-sm text-neutral-70 leading-relaxed",
    actions: "pt-3 flex flex-wrap items-center justify-center gap-2",
    footnote: "text-sm text-neutral-70"
  },
  variants: {
    tone: {
      info: {
        iconWrap:
          "bg-primary-soft text-primary shadow-[0_0_28px_color-mix(in_srgb,var(--color-primary)_28%,transparent)]"
      },
      warning: {
        iconWrap:
          "bg-warning-soft text-warning shadow-[0_0_28px_color-mix(in_srgb,var(--color-warning)_30%,transparent)]"
      },
      danger: {
        iconWrap:
          "bg-danger-soft text-danger shadow-[0_0_28px_color-mix(in_srgb,var(--color-danger)_30%,transparent)]"
      },
      success: {
        iconWrap:
          "bg-success-soft text-success shadow-[0_0_28px_color-mix(in_srgb,var(--color-success)_30%,transparent)]"
      },
      neutral: {
        iconWrap:
          "bg-neutral-30 text-neutral-90 shadow-[0_0_28px_color-mix(in_srgb,var(--color-neutral-90)_20%,transparent)]"
      }
    }
  },
  defaultVariants: {
    tone: "info"
  }
});
