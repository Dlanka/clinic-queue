import { tv } from "tailwind-variants";

export const centerModalStyles = tv({
  slots: {
    dialog:
      "fixed left-1/2 top-1/2 flex max-h-[min(88vh,52rem)] w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-subtle bg-neutral-20 p-0",
    header:
      "relative shrink-0 border-b border-subtle px-5 py-4 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-linear-to-r before:from-danger/65 before:via-primary/65 before:to-info/65",
    body: "mt-0 flex-1 overflow-y-auto px-5 py-4 scrollbar-thin-minimal",
    footer: "mt-0 shrink-0 border-t border-subtle px-5 py-4",
    iconWrap:
      "grid size-10 place-items-center rounded-md bg-primary-soft text-primary shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_28%,transparent)]"
  },
  variants: {
    variant: {
      info: {
        iconWrap:
          "bg-info-soft text-info shadow-[0_0_20px_color-mix(in_srgb,var(--color-info)_28%,transparent)]"
      },
      success: {
        iconWrap:
          "bg-success-soft text-success shadow-[0_0_20px_color-mix(in_srgb,var(--color-success)_28%,transparent)]"
      },
      warning: {
        iconWrap:
          "bg-warning-soft text-warning shadow-[0_0_20px_color-mix(in_srgb,var(--color-warning)_28%,transparent)]"
      },
      danger: {
        iconWrap:
          "bg-danger-soft text-danger shadow-[0_0_20px_color-mix(in_srgb,var(--color-danger)_28%,transparent)]"
      }
    }
  },
  defaultVariants: {
    variant: "info"
  }
});
