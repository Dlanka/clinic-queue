import type { PropsWithChildren, ReactNode } from "react";
import { Card } from "@/components/ui";
import type { IconName } from "@/config/icons";

type SettingsSectionCardProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  iconName?: IconName;
  iconClassName?: string;
  action?: ReactNode;
}>;

export function SettingsSectionCard({
  title,
  subtitle,
  iconName,
  iconClassName,
  action,
  children
}: SettingsSectionCardProps) {
  return (
    <Card>
      <Card.Header
        title={title}
        subtitle={subtitle}
        iconName={iconName}
        iconClassName={iconClassName}
        className="border-b border-subtle"
        action={action}
      />
      <Card.Body className="space-y-4">{children}</Card.Body>
    </Card>
  );
}
