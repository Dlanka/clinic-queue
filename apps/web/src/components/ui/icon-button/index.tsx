import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "../../../lib/cn";
import { iconButtonStyles } from "./icon-button.tv";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  VariantProps<typeof iconButtonStyles> & {
    iconName: IconName;
    iconSize?: number;
  };

export function IconButton({
  size,
  tone,
  className,
  type = "button",
  iconName,
  iconSize = 20,
  ...props
}: IconButtonProps) {
  const Icon = iconMap[iconName];

  return (
    <button type={type} className={cn(iconButtonStyles({ size, tone }), className)} {...props}>
      {Icon ? <Icon size={iconSize} /> : null}
    </button>
  );
}
