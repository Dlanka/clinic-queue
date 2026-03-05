import type { InputHTMLAttributes, ReactNode } from "react";
import type { VariantProps } from "tailwind-variants";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "../../../lib/cn";
import { inputStyles } from "./input.tv";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputStyles> & {
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    shortcutKey?: string;
    startIconName?: IconName;
    endIconName?: IconName;
    iconSize?: number;
    containerClassName?: string;
  };

export function Input({
  invalid,
  size,
  rounded,
  className,
  startAdornment,
  endAdornment,
  shortcutKey,
  startIconName,
  endIconName,
  iconSize = 16,
  containerClassName,
  ...props
}: InputProps) {
  const styles = inputStyles({ invalid, rounded, size });
  const StartIcon = startIconName ? iconMap[startIconName] : null;
  const EndIcon = endIconName ? iconMap[endIconName] : null;
  const hasEndContent = Boolean(endAdornment || shortcutKey || EndIcon);

  return (
    <div className={cn(styles.wrapper(), containerClassName)}>
      {startAdornment ??
        (StartIcon ? <StartIcon size={iconSize} aria-hidden className={styles.icon()} /> : null)}
      <input className={cn(styles.input(), className)} {...props} />
      {hasEndContent ? (
        <div className={styles.endWrapper()}>
          {endAdornment ? endAdornment : null}
          {shortcutKey ? <span className={styles.shortcut()}>{shortcutKey}</span> : null}
          {EndIcon ? <EndIcon size={iconSize} aria-hidden className={styles.icon()} /> : null}
        </div>
      ) : null}
    </div>
  );
}
