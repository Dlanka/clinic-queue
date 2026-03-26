import type { ReactNode } from "react";
import type { IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { IconButton } from "../icon-button";
import { SectionDivider } from "../section-divider";

type CollapsibleSectionProps = {
  label: string;
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
  return (
    <section
      className={cn("overflow-hidden rounded-md border border-subtle bg-neutral-20/70", className)}
    >
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 cursor-pointer ",
          headerClassName,
          open ? "bg-neutral-40/50" : ""
        )}
        onClick={onToggle}
      >
        <SectionDivider
          label={label}
          iconName={iconName}
          showLeadingLine={false}
          showTrailingLine={false}
          className="w-full"
        />
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
