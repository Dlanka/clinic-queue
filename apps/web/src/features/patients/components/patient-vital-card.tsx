import { Badge } from "@/components/ui";
import { VitalMetricCard } from "@/components/ui/vital-metric-card";
import type { IconName } from "@/config/icons";

type PatientVitalCardProps = {
  label: string;
  iconName: IconName;
  iconClassName?: string;
  value: string | number;
  unit: string;
  stateLabel: string;
  stateTone: "neutral" | "success";
};

export function PatientVitalCard({
  label,
  iconName,
  iconClassName,
  value,
  unit,
  stateLabel,
  stateTone
}: PatientVitalCardProps) {
  return (
    <VitalMetricCard
      label={label}
      iconName={iconName}
      iconClassName={iconClassName}
      unit={unit}
      valueSlot={<p className="text-xl font-semibold text-neutral-95">{value}</p>}
      badgeSlot={
        <Badge tone={stateTone} size="sm">
          {stateLabel}
        </Badge>
      }
      className="bg-neutral-30"
    />
  );
}

