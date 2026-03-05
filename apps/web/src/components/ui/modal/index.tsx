import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { modalStyles } from "./modal.tv";

interface BaseModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export function BaseModal({ open, title, description, children, footer, onClose }: BaseModalProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const styles = modalStyles();

  useEffect(() => {
    if (!open) {
      setHost(null);
      return;
    }

    const root = document.getElementById("root");
    if (!root) {
      return;
    }

    const container = document.createElement("div");
    container.setAttribute("data-modal-root", "true");
    root.appendChild(container);
    setHost(container);

    return () => {
      container.remove();
      setHost(null);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!host) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            key="overlay"
            type="button"
            className={styles.overlay()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
          />
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            className={styles.dialog()}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className={styles.title()}>{title}</h2>
            {description ? <p className={styles.description()}>{description}</p> : null}
            <div className={styles.body()}>{children}</div>
            {footer ? <div className={styles.footer()}>{footer}</div> : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    host
  );
}
