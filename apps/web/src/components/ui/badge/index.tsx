import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "../../../lib/cn";
import { badgeStyles } from "./badge.tv";

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeStyles> & {
    withDot?: boolean;
    iconName?: IconName;
    iconSize?: number;
  };

export function Badge({
  tone,
  size,
  variant,
  withDot = false,
  iconName,
  iconSize = 12,
  className,
  children,
  ...props
}: BadgeProps) {
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <span
      className={cn(
        badgeStyles({ tone, size, variant }),
        (withDot || Icon) && "gap-1.5",
        className
      )}
      {...props}
    >
      {withDot ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {Icon ? <Icon size={iconSize} aria-hidden /> : null}
      {children}
    </span>
  );
}
