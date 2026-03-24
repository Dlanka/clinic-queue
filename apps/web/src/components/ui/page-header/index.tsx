import type { PropsWithChildren, ReactNode } from "react";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { pageHeaderStyles } from "./page-header.tv";

interface PageHeaderProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  iconName?: IconName;
  iconSize?: number;
  icon?: ReactNode;
  iconClassName?: string;
  action?: ReactNode;
  cardClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  actionClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  iconName,
  iconSize = 28,
  icon,
  iconClassName,
  action,
  cardClassName,
  headerClassName,
  bodyClassName,
  titleClassName,
  subtitleClassName,
  actionClassName,
  children
}: PageHeaderProps) {
  const styles = pageHeaderStyles();
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <div className={cn(styles.root(), cardClassName)}>
      <div className={cn(styles.header(), "border-none", headerClassName)}>
        {Icon || icon ? (
          <div className={cn(styles.icon(), iconClassName)}>
            {Icon ? <Icon size={iconSize} /> : icon}
          </div>
        ) : null}

        <div>
          <h3 className={cn(styles.title(), titleClassName)}>{title}</h3>
          {subtitle ? <p className={cn(styles.subtitle(), subtitleClassName)}>{subtitle}</p> : null}
        </div>

        {action ? <div className={cn(styles.action(), actionClassName)}>{action}</div> : null}
      </div>

      {children ? <div className={cn(styles.body(), bodyClassName)}>{children}</div> : null}
    </div>
  );
}
