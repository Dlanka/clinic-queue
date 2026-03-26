import type { ComponentProps } from "react";
import { iconMap, type IconName } from "@/config/icons";

export type IconProps = Omit<ComponentProps<"svg">, "ref"> & {
  iconName: IconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export function Icon({ iconName, size = 16, strokeWidth = 2, color = "currentColor", className, ...props }: IconProps) {
  const ResolvedIcon = iconMap[iconName];

  if (!ResolvedIcon) {
    return null;
  }

  return (
    <ResolvedIcon
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={className}
      aria-hidden
      {...props}
    />
  );
}
