import { Card } from "@/components/ui";
import { iconMap, type IconName } from "@/config/icons";

type QueueCounts = {
  WAITING: number;
  IN_PROGRESS: number;
  COMPLETED: number;
  CANCELLED: number;
};

interface QueueStatsGridProps {
  counts: QueueCounts;
}

export function QueueStatsGrid({ counts }: QueueStatsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        {
          label: "Waiting",
          value: counts.WAITING,
          tone: "text-warning",
          iconName: "calendarClock" as IconName,
          boxClass: "bg-warning-soft text-warning"
        },
        {
          label: "InProgress",
          value: counts.IN_PROGRESS,
          tone: "text-info",
          iconName: "refreshCcw" as IconName,
          boxClass: "bg-primary-soft text-primary"
        },
        {
          label: "Completed",
          value: counts.COMPLETED,
          tone: "text-success",
          iconName: "check" as IconName,
          boxClass: "bg-success-soft text-success"
        },
        {
          label: "Cancelled",
          value: counts.CANCELLED,
          tone: "text-danger",
          iconName: "x" as IconName,
          boxClass: "bg-danger-soft text-danger"
        }
      ].map((item) => {
        const Icon = iconMap[item.iconName];

        return (
          <Card key={item.label} className={` ${item.tone}`}>
            <Card.Body className="flex items-center gap-4 px-5 py-5">
              <div className={`grid h-10 w-10 place-items-center rounded-md ${item.boxClass}`}>
                <Icon size={20} />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold leading-none">{item.value}</p>
                <p className="text-xs text-neutral-70">{item.label}</p>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
