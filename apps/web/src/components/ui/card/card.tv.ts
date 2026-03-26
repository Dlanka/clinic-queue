import { tv } from "tailwind-variants";

export const cardStyles = tv({
  slots: {
    root: "overflow-hidden rounded-xl bg-neutral-30 border border-subtle",
    header: "flex items-center gap-3 border-b border-subtle px-6 py-4",
    icon: "grid p-2 place-items-center rounded-md",
    title: "text-base font-bold text-neutral-90/90",
    subtitle: "text-xs text-neutral-90/60",
    action: "ml-auto",
    body: "p-6"
  }
});
