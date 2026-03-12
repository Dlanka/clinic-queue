import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconButton } from "../icon-button";
import { rightPanelModalStyles } from "./right-panel-modal.tv";

type RightPanelModalProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function RightPanelModal({
  open,
  title,
  description,
  children,
  footer,
  onClose
}: RightPanelModalProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const styles = rightPanelModalStyles();

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
    container.setAttribute("data-right-panel-modal-root", "true");
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
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            className={styles.panel()}
            initial={{ x: 44 }}
            animate={{ x: 0 }}
            exit={{ x: 44 }}
            transition={{ duration: 0.2 }}
          >
            <header className={styles.header()}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className={styles.title()}>{title}</h2>
                  {description ? <p className={styles.description()}>{description}</p> : null}
                </div>
                <IconButton iconName="x" aria-label="Close panel" onClick={onClose} />
              </div>
            </header>

            <div className={styles.body()}>{children}</div>
            {footer ? <div className={styles.footer()}>{footer}</div> : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>,
    host
  );
}
