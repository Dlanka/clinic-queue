import type { InputHTMLAttributes } from "react";
import { radioButtonStyles } from "./radio-button.tv";

interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export function RadioButton({ id, label, ...props }: RadioButtonProps) {
  const styles = radioButtonStyles();

  return (
    <label htmlFor={id} className={styles.root()}>
      <input id={id} type="radio" className={styles.input()} {...props} />
      <span className={styles.label()}>{label}</span>
    </label>
  );
}
