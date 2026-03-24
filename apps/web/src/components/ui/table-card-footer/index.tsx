import { format } from "date-fns";
import { cn } from "@/lib/cn";
import { Button } from "../button";

interface TableCardFooterProps {
  shownCount: number;
  totalCount: number;
  itemLabel: string;
  updatedAt?: number;
  onRefresh?: () => void;
  className?: string;
  showTopBorder?: boolean;
}

export function TableCardFooter({
  shownCount,
  totalCount,
  itemLabel,
  updatedAt,
  onRefresh,
  className,
  showTopBorder = false
}: TableCardFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm text-neutral-80",
        showTopBorder ? "border-t border-subtle" : "",
        className
      )}
    >
      <p className="text-xs text-neutral-70">
        Showing {shownCount} of {totalCount} {itemLabel} - Last updated{" "}
        {updatedAt ? format(updatedAt, "h:mm a") : "-"}
      </p>

      {onRefresh ? (
        <Button
          size="sm"
          variant="text"
          intent="neutral"
          startIconName="refreshCcw"
          onClick={onRefresh}
        >
          Refresh
        </Button>
      ) : null}
    </div>
  );
}
