import type { HTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../../lib/cn";
import { avatarStyles } from "./avatar.tv";

const avatarGradientClasses = [
  "bg-linear-to-br from-primary to-tertiary",
  "bg-linear-to-br from-info to-primary",
  "bg-linear-to-br from-success to-primary",
  "bg-linear-to-br from-warning to-danger",
  "bg-linear-to-br from-tertiary to-info",
  "bg-linear-to-br from-secondary to-primary",
  "bg-linear-to-br from-primary to-success",
  "bg-linear-to-br from-info to-tertiary"
] as const;

function initialsFromValue(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "NA";
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "NA";
  }

  return `${parts[0]?.charAt(0) ?? ""}${parts[1]?.charAt(0) ?? ""}`.toUpperCase();
}

function gradientBySeed(seed: string) {
  const firstChar = seed.trim().charAt(0).toUpperCase();
  const charCode = firstChar ? firstChar.charCodeAt(0) : 0;
  return avatarGradientClasses[charCode % avatarGradientClasses.length];
}

type AvatarProps = Omit<HTMLAttributes<HTMLElement>, "children"> &
  VariantProps<typeof avatarStyles> & {
    label?: string;
    name?: string;
    as?: "span" | "button";
  };

export function Avatar({
  label,
  name,
  as = "span",
  size,
  className,
  onClick,
  ...props
}: AvatarProps) {
  const content = label?.trim() ? label : initialsFromValue(name ?? "");
  const seed = name?.trim() || label?.trim() || content;
  const gradientClassName = gradientBySeed(seed);
  const interactive = as === "button";

  if (as === "button") {
    return (
      <button
        type="button"
        className={cn(avatarStyles({ size, interactive }), gradientClassName, className)}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={cn(avatarStyles({ size }), gradientClassName, className)} {...props}>
      {content}
    </span>
  );
}
