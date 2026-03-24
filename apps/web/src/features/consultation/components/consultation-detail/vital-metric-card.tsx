import type { InputHTMLAttributes, ReactNode } from "react";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";

interface VitalMetricCardProps {
  label: string;
  iconName: IconName;
  unit: string;
  valueSlot?: ReactNode;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  inputClassName?: string;
  badgeSlot?: ReactNode;
  iconClassName?: string;
  className?: string;
}

export function VitalMetricCard({
  label,
  iconName,
  unit,
  valueSlot,
  inputProps,
  inputClassName,
  badgeSlot,
  iconClassName,
  className
}: VitalMetricCardProps) {
  const Icon = iconMap[iconName];

  return (
    <div
      className={cn(
        "rounded-md border border-subtle bg-neutral-40/50 px-3 py-2 transition-all duration-200 focus-within:border-primary/45 focus-within:shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-primary)_45%,transparent),0_0_24px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]",
        className
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-2xs font-semibold text-neutral-70">
          <Icon size={12} className={cn("text-neutral-70", iconClassName)} /> <span>{label}</span>
        </span>
        {badgeSlot}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          {inputProps ? (
            <input
              className={cn(
                "w-full [appearance:textfield] bg-transparent text-base font-bold leading-none text-neutral-95 placeholder:text-neutral-70 focus:outline-none disabled:opacity-100 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                inputClassName
              )}
              {...inputProps}
            />
          ) : (
            valueSlot
          )}
        </div>
        <span className="pb-1 text-xs font-semibold text-neutral-70">{unit}</span>
      </div>
    </div>
  );
}
