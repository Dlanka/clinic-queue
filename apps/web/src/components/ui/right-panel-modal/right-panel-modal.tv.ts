import { tv } from "tailwind-variants";

export const rightPanelModalStyles = tv({
  slots: {
    overlay: "fixed inset-0 z-40 bg-neutral-0/55 backdrop-blur-sm",
    panel:
      "fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col  bg-neutral-30 shadow-2xl",
    header: "border-b border-subtle p-5 px-6",
    title: "text-lg font-bold text-neutral-95",
    description: "text-xs mt-0.5 text-neutral-70",
    body: "flex-1 overflow-y-auto px-6 py-5 text-neutral-90",
    footer: "flex justify-end gap-2 px-6 py-4 border-t border-subtle"
  }
});
