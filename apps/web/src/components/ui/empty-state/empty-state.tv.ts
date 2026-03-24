import { tv } from "tailwind-variants";

export const emptyStateStyles = tv({
  slots: {
    root: "flex min-h-64 flex-col items-center justify-center gap-2 px-5 py-8 text-center",
    iconWrap: "grid size-10 place-items-center rounded-md text-neutral-70",
    title: "text-sm font-semibold text-neutral-90",
    description: "max-w-84 text-xs text-neutral-70",
    action: "mt-2"
  }
});
