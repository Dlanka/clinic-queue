import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ConsultationMetaItemProps {
  label: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function ConsultationMetaItem({
  label,
  value,
  className,
  labelClassName,
  valueClassName
}: ConsultationMetaItemProps) {
  return (
    <div
      className={cn(
        "relative border-r border-neutral-70/30 pr-4 mr-4 last:border-0 last:pr-0",
        className
      )}
    >
      <p className={cn("text-2xs uppercase tracking-section text-neutral-70", labelClassName)}>
        {label}
      </p>
      <p className={cn("text-xs font-semibold text-neutral-90", valueClassName)}>{value}</p>
    </div>
  );
}
