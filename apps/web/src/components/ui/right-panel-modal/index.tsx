import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "../icon-button";
import { rightPanelModalStyles } from "./right-panel-modal.tv";

type RightPanelModalVariant = "info" | "success" | "warning" | "danger";

type RightPanelModalProps = {
  open: boolean;
  title: string;
  titleBadge?: ReactNode;
  description?: string;
  headerContent?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  iconName?: IconName;
  variant?: RightPanelModalVariant;
  onClose: () => void;
  panelClassName?: string;
};

export function RightPanelModal({
  open,
  title,
  titleBadge,
  description,
  headerContent,
  children,
  footer,
  iconName = "clipboardList",
  variant = "info",
  onClose,
  panelClassName
}: RightPanelModalProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const styles = rightPanelModalStyles({ variant });
  const HeaderIcon = iconMap[iconName];

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
            className={cn(styles.panel(), panelClassName)}
            initial={{ x: 44 }}
            animate={{ x: 0 }}
            exit={{ x: 44 }}
            transition={{ duration: 0.2 }}
          >
            <header className={styles.header()}>
              <div className={styles.headerTop()}>
                <div className={styles.heading()}>
                  <span className={styles.iconWrap()}>
                    <HeaderIcon size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={styles.title()}>{title}</h2>
                      {titleBadge}
                    </div>
                    {description ? <p className={styles.description()}>{description}</p> : null}
                  </div>
                </div>
                <IconButton iconName="x" aria-label="Close panel" onClick={onClose} />
              </div>
              {headerContent ? <div className="mt-4">{headerContent}</div> : null}
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
