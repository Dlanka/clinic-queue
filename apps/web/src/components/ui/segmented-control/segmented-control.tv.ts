import { tv } from "tailwind-variants";

export const segmentedControlStyles = tv({
  slots: {
    root: "inline-grid grid-flow-col gap-1 rounded-full bg-neutral-40 p-1",
    rootFullWidth: "grid w-full",
    item: "inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
    itemFullWidth: "w-full",
    itemSelected:
      "bg-primary font-bold text-primary-10 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-primary)_35%,transparent)_inset]",
    itemUnselected: "bg-transparent text-neutral-70 hover:text-neutral-90",
    icon: "shrink-0"
  }
});
