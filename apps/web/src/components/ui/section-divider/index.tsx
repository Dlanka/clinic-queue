import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";

type SectionDividerProps = {
  label: string;
  iconName?: IconName;
  iconClassName?: string;
  showLeadingLine?: boolean;
  showTrailingLine?: boolean;
  className?: string;
  labelClassName?: string;
  lineClassName?: string;
};

export function SectionDivider({
  label,
  iconName,
  iconClassName,
  showLeadingLine = true,
  showTrailingLine = true,
  className,
  labelClassName,
  lineClassName
}: SectionDividerProps) {
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLeadingLine ? <span className={cn("h-px flex-1 bg-subtle", lineClassName)} /> : null}
      {Icon ? (
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-xs bg-tertiary-soft text-tertiary",
            iconClassName
          )}
        >
          <Icon size={12} />
        </span>
      ) : null}
      <p
        className={cn(
          "text-3xs font-semibold uppercase tracking-section text-neutral-70 ",
          labelClassName
        )}
      >
        {label}
      </p>
      {showTrailingLine ? <span className={cn("h-px flex-1 bg-subtle", lineClassName)} /> : null}
    </div>
  );
}
