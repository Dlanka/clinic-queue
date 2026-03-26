import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "tailwind-variants";
import { switchStyles } from "./switch.tv";
import { Icon } from "../icon";

interface SwitchProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof switchStyles> {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, intent, label, onCheckedChange, ...props }: SwitchProps) {
  const styles = switchStyles({ checked, intent });
  const { onClick, ...restProps } = props;

  return (
    <div className={styles.root()}>
      <button
        role="switch"
        aria-checked={checked}
        type="button"
        className={styles.track()}
        onClick={(event) => {
          onCheckedChange(!checked);
          onClick?.(event);
        }}
        {...restProps}
      >
        <span className={styles.thumb()}>
          <Icon strokeWidth={2} iconName={checked ? "check" : "x"} size={12} />
        </span>
      </button>
      <span className={styles.label()}>{label}</span>
    </div>
  );
}
