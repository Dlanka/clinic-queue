import { tv } from "tailwind-variants";

export const iconButtonStyles = tv({
  base: "grid place-items-center  transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
  variants: {
    size: {
      sm: "h-7 w-7 rounded-sm",
      md: "h-8 w-8 rounded-md",
      lg: "h-10 w-10 rounded-md"
    },
    variant: {
      fill: "",
      tonal: "",
      text: "",
      outlined: ""
    },
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
    }
  },
  compoundVariants: [
    {
      intent: ["primary", "info"],
      variant: "fill",
      class: "bg-primary text-on-primary hover:brightness-110"
    },
    {
      intent: "success",
      variant: "fill",
      class: "bg-success text-neutral-10 hover:brightness-110"
    },
    {
      intent: "warning",
      variant: "fill",
      class: "bg-warning text-neutral-10 hover:brightness-110"
    },
    {
      intent: ["danger", "error"],
      variant: "fill",
      class: "bg-danger text-neutral-10 hover:bg-danger-hover"
    },
    {
      intent: "secondary",
      variant: "fill",
      class: "bg-neutral-40 text-neutral-95 hover:bg-neutral-variant-80 hover:text-neutral-100"
    },
    {
      intent: "neutral",
      variant: "fill",
      class: "bg-neutral-30 text-neutral-95 hover:bg-neutral-40 hover:text-neutral-100"
    },
    {
      intent: "ghost",
      variant: "fill",
      class: "bg-transparent text-primary hover:bg-primary-soft"
    },

    {
      intent: ["primary", "info"],
      variant: "tonal",
      class: "bg-primary-soft text-primary hover:brightness-110"
    },
    {
      intent: "success",
      variant: "tonal",
      class: "bg-success-soft text-success hover:brightness-110"
    },
    {
      intent: "warning",
      variant: "tonal",
      class: "bg-warning-soft text-warning hover:brightness-110"
    },
    {
      intent: ["danger", "error"],
      variant: "tonal",
      class: "bg-danger-soft text-danger hover:brightness-110"
    },
    {
      intent: "secondary",
      variant: "tonal",
      class: "bg-neutral-40 text-neutral-95 hover:bg-neutral-variant-80"
    },
    {
      intent: "neutral",
      variant: "tonal",
      class: "bg-neutral-30 text-neutral-95 hover:bg-neutral-40"
    },
    {
      intent: "ghost",
      variant: "tonal",
      class: "bg-primary-soft text-primary hover:brightness-110"
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
      class: "bg-transparent text-neutral-70 hover:bg-neutral-40"
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
    size: "md",
    intent: "neutral",
    variant: "text"
  }
});
