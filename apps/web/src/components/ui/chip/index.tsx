import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { iconMap, type IconName } from "@/config/icons";
import { chipStyles } from "./chip.tv";

type ChipProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof chipStyles> & {
    withDot?: boolean;
    label?: string;
    iconName?: IconName;
    iconSize?: number;
  };

export function Chip({
  tone,
  size,
  withDot = false,
  label,
  iconName,
  iconSize = 12,
  className,
  children,
  ...props
}: ChipProps) {
  const styles = chipStyles({ tone, size });
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <span className={styles.root({ className })} {...props}>
      {withDot ? <span aria-hidden className={styles.dot()} /> : null}
      {Icon ? <Icon size={iconSize} aria-hidden /> : null}
      {label ?? children}
    </span>
  );
}
