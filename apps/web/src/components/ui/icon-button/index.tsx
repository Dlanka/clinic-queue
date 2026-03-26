import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "../../../lib/cn";
import { iconButtonStyles } from "./icon-button.tv";

type IconButtonIntent = "primary" | "secondary" | "neutral" | "ghost" | "danger" | "error" | "success" | "warning" | "info";
type IconButtonTone = "neutral" | "primary" | "danger";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  Omit<VariantProps<typeof iconButtonStyles>, "intent"> & {
    intent?: IconButtonIntent;
    tone?: IconButtonTone;
    iconName: IconName;
    iconSize?: number;
  };

export function IconButton({
  size,
  variant,
  intent,
  tone,
  className,
  type = "button",
  iconName,
  iconSize = 20,
  ...props
}: IconButtonProps) {
  const Icon = iconMap[iconName];
  const resolvedIntent: IconButtonIntent =
    intent ??
    (tone === "primary" ? "primary" : tone === "danger" ? "danger" : "neutral");

  return (
    <button
      type={type}
      className={cn(iconButtonStyles({ size, variant, intent: resolvedIntent }), className)}
      {...props}
    >
      {Icon ? <Icon size={iconSize} /> : null}
    </button>
  );
}
