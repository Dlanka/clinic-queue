import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { modalStyles } from "./modal.tv";

interface BaseModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  titlePrefix?: ReactNode;
  titleAction?: ReactNode;
  dialogClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  onClose: () => void;
}

export function BaseModal({
  open,
  title,
  description,
  children,
  footer,
  titlePrefix,
  titleAction,
  dialogClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  bodyClassName,
  footerClassName,
  onClose
}: BaseModalProps) {
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

    const html = document.documentElement;
    const root = document.getElementById("root");
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = root?.style.overflow ?? "";

    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (root) {
      root.style.overflow = "hidden";
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      html.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      if (root) {
        root.style.overflow = previousRootOverflow;
      }
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
            className={cn(styles.dialog(), dialogClassName)}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className={cn(styles.header(), headerClassName)}>
              {titlePrefix}
              <div className={styles.heading()}>
                <h2 className={cn(styles.title(), titleClassName)}>{title}</h2>
                {description ? (
                  <p className={cn(styles.description(), descriptionClassName)}>{description}</p>
                ) : null}
              </div>
              {titleAction}
            </div>
            <div className={cn(styles.body(), bodyClassName)}>{children}</div>
            {footer ? <div className={cn(styles.footer(), footerClassName)}>{footer}</div> : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    host
  );
}
