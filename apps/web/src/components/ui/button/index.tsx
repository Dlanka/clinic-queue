import type { ButtonHTMLAttributes } from "react";
import { type VariantProps } from "tailwind-variants";
import { iconMap, type IconName } from "@/config/icons";
import { buttonStyles } from "./button.tv";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    startIconName?: IconName;
    endIconName?: IconName;
    iconSize?: number;
  };

export function Button({
  intent,
  size,
  className,
  type = "button",
  startIconName,
  endIconName,
  iconSize = 16,
  children,
  ...props
}: ButtonProps) {
  const StartIcon = startIconName ? iconMap[startIconName] : null;
  const EndIcon = endIconName ? iconMap[endIconName] : null;

  return (
    <button type={type} className={cn(buttonStyles({ intent, size }), className)} {...props}>
      {StartIcon ? <StartIcon size={iconSize} aria-hidden /> : null}
      {children}
      {EndIcon ? <EndIcon size={iconSize} aria-hidden /> : null}
    </button>
  );
}
