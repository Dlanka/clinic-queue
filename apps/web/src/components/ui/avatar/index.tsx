import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../../lib/cn";
import { avatarStyles } from "./avatar.tv";

type AvatarProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  VariantProps<typeof avatarStyles> & {
    label: string;
  };

export function Avatar({ label, size, className, type = "button", ...props }: AvatarProps) {
  return (
    <button type={type} className={cn(avatarStyles({ size }), className)} {...props}>
      {label}
    </button>
  );
}
