import { tv } from "tailwind-variants";

export const toastCardStyles = tv({
  base: "rounded-xl border border-neutral-variant-80 bg-white text-neutral-10 shadow-lg"
});

export const toastToneStyles = tv({
  variants: {
    tone: {
      success: "border-success bg-success-soft text-success",
      error: "border-danger bg-danger-soft text-danger"
    }
  }
});
