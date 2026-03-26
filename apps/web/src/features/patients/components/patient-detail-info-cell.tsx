import { cn } from "@/lib/cn";

type PatientDetailInfoCellProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

export function PatientDetailInfoCell({
  label,
  value,
  valueClassName
}: PatientDetailInfoCellProps) {
  return (
    <div className="border-t border-subtle px-4 py-3 last:border-r-0 sm:border-r sm:first:border-t-0 lg:border-t-0">
      <p className="text-2xs uppercase tracking-section text-neutral-70">{label}</p>
      <p className={cn("text-sm font-semibold text-neutral-95", valueClassName)}>{value}</p>
    </div>
  );
}
