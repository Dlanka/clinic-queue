import type { ReactNode } from "react";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { emptyStateStyles } from "./empty-state.tv";

interface EmptyStateProps {
  title: string;
  description?: string;
  iconName?: IconName;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  iconName = "clipboardList",
  action,
  className
}: EmptyStateProps) {
  const styles = emptyStateStyles();
  const Icon = iconMap[iconName];

  return (
    <div className={cn(styles.root(), className)}>
      <span className={styles.iconWrap()}>
        <Icon size={32} aria-hidden strokeWidth={1} />
      </span>
      <p className={styles.title()}>{title}</p>
      {description ? <p className={styles.description()}>{description}</p> : null}
      {action ? <div className={styles.action()}>{action}</div> : null}
    </div>
  );
}
