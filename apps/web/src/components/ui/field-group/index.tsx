import type { PropsWithChildren } from "react";
import { fieldGroupStyles } from "./field-group.tv";

interface FieldGroupProps extends PropsWithChildren {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
}

export function FieldGroup({ id, label, hint, error, children }: FieldGroupProps) {
  const styles = fieldGroupStyles();

  return (
    <div className={styles.root()}>
      <label htmlFor={id} className={styles.label()}>
        {label}
      </label>
      {children}
      {!error && hint ? <p className={styles.hint()}>{hint}</p> : null}
      {error ? <p className={styles.error()}>{error}</p> : null}
    </div>
  );
}
