import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../../lib/cn";
import { badgeStyles } from "./badge.tv";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeStyles>;

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ tone }), className)} {...props} />;
}
