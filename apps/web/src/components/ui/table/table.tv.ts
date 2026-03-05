import { tv } from "tailwind-variants";

export const tableStyles = tv({
  slots: {
    wrapper: "overflow-hidden border-y border-subtle bg-neutral-30",
    table: "min-w-full border-collapse",
    head: "bg-neutral-30",
    th: "px-4 py-2.5 text-left text-2xs font-semibold uppercase tracking-[0.08em] text-neutral-70",
    row: "border-t border-subtle transition-colors hover:bg-neutral-30",
    td: "px-4 py-3 text-sm text-neutral-95",
    empty: "px-4 py-8 text-center text-sm text-neutral-70"
  }
});
