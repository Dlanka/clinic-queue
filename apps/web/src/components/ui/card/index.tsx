import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { iconMap, type IconName } from "@/config/icons";
import { cardStyles } from "./card.tv";

interface CardProps extends PropsWithChildren {
  className?: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  iconName?: IconName;
  iconSize?: number;
  icon?: ReactNode;
  iconClassName?: string;
  action?: ReactNode;
  className?: string;
}

interface CardBodyProps extends PropsWithChildren {
  className?: string;
}

function CardRoot({ className, children }: CardProps) {
  const styles = cardStyles();
  return <div className={cn(styles.root(), className)}>{children}</div>;
}

export function CardHeader({
  title,
  subtitle,
  iconName,
  iconSize = 20,
  icon,
  iconClassName,
  action,
  className
}: CardHeaderProps) {
  const styles = cardStyles();
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <div className={cn(styles.header(), className)}>
      {Icon || icon ? (
        <div className={cn(styles.icon(), iconClassName)}>
          {Icon ? <Icon size={iconSize} /> : icon}
        </div>
      ) : null}
      <div>
        <h3 className={styles.title()}>{title}</h3>
        {subtitle ? <p className={styles.subtitle()}>{subtitle}</p> : null}
      </div>
      {action ? <div className={styles.action()}>{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: CardBodyProps) {
  const styles = cardStyles();
  return <div className={cn(styles.body(), className)}>{children}</div>;
}

type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
};

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody
}) as CardComponent;
