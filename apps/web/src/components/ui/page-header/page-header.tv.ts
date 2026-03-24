import { tv } from "tailwind-variants";

export const pageHeaderStyles = tv({
  slots: {
    root: "overflow-hidden rounded-xl bg-neutral-30",
    header: "flex items-center gap-4 border-b border-subtle px-6 py-6",
    icon: "bg-primary-soft grid place-items-center rounded-md p-2 text-primary shadow-[0_0_16px_color-mix(in_srgb,var(--color-primary)_28%,transparent)]",
    title: "text-xl font-bold text-neutral-90/90",
    subtitle: "text-xs text-neutral-90/60",
    action: "ml-auto",
    body: "p-6"
  }
});
