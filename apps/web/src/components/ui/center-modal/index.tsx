import type { ReactNode } from "react";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { BaseModal } from "../modal";
import { IconButton } from "../icon-button";
import { centerModalStyles } from "./center-modal.tv";

type CenterModalVariant = "info" | "success" | "warning" | "danger";

interface CenterModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  iconName?: IconName;
  variant?: CenterModalVariant;
  // Preferred prop for Tailwind IntelliSense and general dialog customization.
  className?: string;
  onClose: () => void;
}

export function CenterModal({
  open,
  title,
  description,
  children,
  footer,
  iconName = "clipboardList",
  variant = "info",
  className,
  onClose
}: CenterModalProps) {
  const styles = centerModalStyles({ variant });
  const Icon = iconMap[iconName];

  return (
    <BaseModal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      dialogClassName={cn(styles.dialog(), className)}
      headerClassName={styles.header()}
      bodyClassName={styles.body()}
      footerClassName={styles.footer()}
      titlePrefix={
        <span className={styles.iconWrap()}>
          <Icon size={20} />
        </span>
      }
      titleAction={
        <IconButton
          type="button"
          iconName="x"
          tone="neutral"
          aria-label="Close modal"
          onClick={onClose}
        />
      }
      footer={footer}
    >
      {children}
    </BaseModal>
  );
}
