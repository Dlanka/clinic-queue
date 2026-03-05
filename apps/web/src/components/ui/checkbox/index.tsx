import type { InputHTMLAttributes } from "react";
import { checkboxStyles } from "./checkbox.tv";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

export function Checkbox({ id, label, hint, ...props }: CheckboxProps) {
  const styles = checkboxStyles();

  return (
    <label htmlFor={id} className={styles.root()}>
      <input id={id} type="checkbox" className={styles.input()} {...props} />
      <span>
        <span className={styles.text()}>{label}</span>
        {hint ? <span className={`block ${styles.hint()}`}>{hint}</span> : null}
      </span>
    </label>
  );
}
