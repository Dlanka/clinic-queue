import { tv } from "tailwind-variants";
import { classes } from "@/lib/classes";

export const buttonStyles = tv({
  base: classes(
    "inline-flex",
    "cursor-pointer",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-full",
    "font-bold",
    "transition-all",
    "duration-200",
    "disabled:cursor-not-allowed",
    "disabled:bg-neutral-40",
    "disabled:text-neutral-70",
    "disabled:opacity-60",
    "disabled:shadow-none",
    "disabled:transform-none"
  ),
  variants: {
    intent: {
      primary: "",
      secondary: "",
      neutral: "",
      ghost: "",
      danger: "",
      error: "",
      success: "",
      warning: "",
      info: ""
    },
    variant: {
      fill: "",
      tonal: "",
      text: "",
      outlined: ""
    },
    size: {
      sm: "h-8 px-5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "h-12 px-6 text-base"
    }
  },
  compoundVariants: [
    {
      intent: ["primary", "info"],
      variant: "fill",
      class: classes(
        "bg-linear-to-br",
        "from-primary",
        "to-primary-hover",
        "text-on-primary",
        "shadow-[0_4px_20px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]",
        "hover:-translate-y-0.5",
        "hover:brightness-110"
      )
    },
    {
      intent: "success",
      variant: "fill",
      class: classes(
        "bg-linear-to-br",
        "from-success",
        "to-success",
        "text-neutral-10",
        "shadow-[0_4px_20px_color-mix(in_srgb,var(--color-success)_30%,transparent)]",
        "hover:-translate-y-0.5",
        "hover:brightness-110"
      )
    },
    {
      intent: "warning",
      variant: "fill",
      class: classes(
        "bg-linear-to-br",
        "from-warning",
        "to-warning",
        "text-neutral-10",
        "shadow-[0_4px_20px_color-mix(in_srgb,var(--color-warning)_28%,transparent)]",
        "hover:-translate-y-0.5",
        "hover:brightness-110"
      )
    },
    {
      intent: ["danger", "error"],
      variant: "fill",
      class: classes(
        "bg-danger",
        "text-neutral-10",
        "shadow-[0_4px_20px_color-mix(in_srgb,var(--color-danger)_28%,transparent)]",
        "hover:-translate-y-0.5",
        "hover:bg-danger-hover"
      )
    },
    {
      intent: "secondary",
      variant: "fill",
      class: classes(
        "bg-neutral-40",
        "text-neutral-95",
        "hover:bg-neutral-variant-80",
        "hover:text-neutral-100"
      )
    },
    {
      intent: "neutral",
      variant: "fill",
      class: classes(
        "bg-neutral-30",
        "text-neutral-95",
        "hover:bg-neutral-40",
        "hover:text-neutral-100"
      )
    },
    {
      intent: "ghost",
      variant: "fill",
      class: "bg-transparent text-primary hover:bg-primary-soft"
    },

    {
      intent: ["primary", "info"],
      variant: "tonal",
      class: "bg-primary-soft text-primary hover:-translate-y-0.5 hover:brightness-110"
    },
    {
      intent: "success",
      variant: "tonal",
      class: "bg-success-soft text-success hover:-translate-y-0.5 hover:brightness-110"
    },
    {
      intent: "warning",
      variant: "tonal",
      class: "bg-warning-soft text-warning hover:-translate-y-0.5 hover:brightness-110"
    },
    {
      intent: ["danger", "error"],
      variant: "tonal",
      class: "bg-danger-soft text-danger hover:-translate-y-0.5 hover:brightness-110"
    },
    {
      intent: "secondary",
      variant: "tonal",
      class: "bg-neutral-40 text-neutral-95 hover:-translate-y-0.5 hover:bg-neutral-variant-80"
    },
    {
      intent: "neutral",
      variant: "tonal",
      class: "bg-neutral-30 text-neutral-95 hover:-translate-y-0.5 hover:bg-neutral-40"
    },
    {
      intent: "ghost",
      variant: "tonal",
      class: "bg-primary-soft text-primary hover:-translate-y-0.5 hover:brightness-110"
    },

    {
      intent: ["primary", "info"],
      variant: "text",
      class: "bg-transparent text-primary hover:bg-primary-soft"
    },
    {
      intent: "success",
      variant: "text",
      class: "bg-transparent text-success hover:bg-success-soft"
    },
    {
      intent: "warning",
      variant: "text",
      class: "bg-transparent text-warning hover:bg-warning-soft"
    },
    {
      intent: ["danger", "error"],
      variant: "text",
      class: "bg-transparent text-danger hover:bg-danger-soft"
    },
    {
      intent: "secondary",
      variant: "text",
      class: "bg-transparent text-neutral-90 hover:bg-neutral-40 hover:text-neutral-100"
    },
    {
      intent: "neutral",
      variant: "text",
      class: "bg-transparent text-neutral-70 hover:bg-neutral-40 "
    },
    {
      intent: "ghost",
      variant: "text",
      class: "bg-transparent text-primary hover:bg-primary-soft"
    },

    {
      intent: ["primary", "info"],
      variant: "outlined",
      class: "border border-primary/45 bg-transparent text-primary hover:bg-primary-soft"
    },
    {
      intent: "success",
      variant: "outlined",
      class: "border border-success/45 bg-transparent text-success hover:bg-success-soft"
    },
    {
      intent: "warning",
      variant: "outlined",
      class: "border border-warning/45 bg-transparent text-warning hover:bg-warning-soft"
    },
    {
      intent: ["danger", "error"],
      variant: "outlined",
      class: "border border-danger/45 bg-transparent text-danger hover:bg-danger-soft"
    },
    {
      intent: "secondary",
      variant: "outlined",
      class: "border border-neutral-variant-80 bg-transparent text-neutral-90 hover:bg-neutral-40"
    },
    {
      intent: "neutral",
      variant: "outlined",
      class: "border border-subtle bg-transparent text-neutral-90 hover:bg-neutral-30"
    },
    {
      intent: "ghost",
      variant: "outlined",
      class: "border border-primary/45 bg-transparent text-primary hover:bg-primary-soft"
    }
  ],
  defaultVariants: {
    intent: "primary",
    variant: "fill",
    size: "md"
  }
});
