import type { ButtonHTMLAttributes } from "react";
import { switchStyles } from "./switch.tv";

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, label, onCheckedChange, ...props }: SwitchProps) {
  const styles = switchStyles({ checked });

  return (
    <div className={styles.root()}>
      <button
        role="switch"
        aria-checked={checked}
        type="button"
        className={styles.track()}
        onClick={() => onCheckedChange(!checked)}
        {...props}
      >
        <span className={styles.thumb()} />
      </button>
      <span className={styles.label()}>{label}</span>
    </div>
  );
}
