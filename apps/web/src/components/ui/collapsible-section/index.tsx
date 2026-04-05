import type { ReactNode } from "react";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "../icon-button";

type CollapsibleSectionProps = {
  label: string | React.ReactNode;
  iconName?: IconName;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function CollapsibleSection({
  label,
  iconName,
  open,
  onToggle,
  children,
  loading = false,
  loadingText = "Loading...",
  className,
  headerClassName,
  contentClassName
}: CollapsibleSectionProps) {
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <section
      className={cn("overflow-hidden rounded-md border border-subtle bg-neutral-30/70", className)}
    >
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 cursor-pointer ",
          headerClassName,
          open ? "bg-neutral-40/50" : "bg-primary-soft/35"
        )}
        onClick={onToggle}
      >
        <div className="flex gap-2">
          {Icon ? (
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-xs bg-tertiary-soft text-tertiary"
              )}
            >
              <Icon size={12} />
            </span>
          ) : null}

          <div className="text-sm text-primary">{label}</div>
        </div>

        <IconButton
          size="sm"
          variant="text"
          intent="neutral"
          iconName={open ? "chevronUp" : "chevronDown"}
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
        />
      </div>

      {open ? (
        <div className="border-t border-subtle px-3 py-3">
          {loading ? (
            <p className="text-sm text-neutral-70">{loadingText}</p>
          ) : (
            <div className={contentClassName}>{children}</div>
          )}
        </div>
      ) : null}
    </section>
  );
}
