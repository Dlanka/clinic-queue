import type { PropsWithChildren } from "react";
import { fieldGroupStyles } from "./field-group.tv";

interface FieldGroupProps extends PropsWithChildren {
  id?: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

export function FieldGroup({ id, label, required, hint, error, children }: FieldGroupProps) {
  const styles = fieldGroupStyles();

  return (
    <div className={styles.root()}>
      <label htmlFor={id} className={styles.label()}>
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-primary inline-flex">
            *
          </span>
        ) : null}
      </label>
      <div className={styles.controller()}>
        {children}
        {!error && hint ? <p className={styles.hint()}>{hint}</p> : null}
        {error ? <p className={styles.error()}>{error}</p> : null}
      </div>
    </div>
  );
}
