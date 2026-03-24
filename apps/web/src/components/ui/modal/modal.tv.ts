import { tv } from "tailwind-variants";

export const modalStyles = tv({
  slots: {
    overlay: "fixed inset-0 z-40 bg-neutral-0/55 backdrop-blur-sm",
    dialog:
      "fixed left-1/2 top-1/2 z-50 w-[min(92vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-variant-80 bg-neutral-20 p-6 shadow-2xl",
    header: "flex items-start gap-3",
    heading: "min-w-0 flex-1",
    title: "text-lg font-bold text-neutral-95",
    description: "mt-1 text-sm text-neutral-70",
    body: "mt-4 text-neutral-90",
    footer: "mt-5 flex justify-end gap-2"
  }
});
