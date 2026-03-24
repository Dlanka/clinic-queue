import { Card } from "@/components/ui";
import { iconMap } from "@/config/icons";

interface PrescriptionsStatsGridProps {
  counts: {
    all: number;
    prescribed: number;
    dispensed: number;
    items: number;
  };
}

export function PrescriptionsStatsGrid({ counts }: PrescriptionsStatsGridProps) {
  const ClipboardIcon = iconMap.clipboardList;
  const ClockIcon = iconMap.clock3;
  const CheckIcon = iconMap.check;
  const BoxIcon = iconMap.calendarDays;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-info-soft text-info">
            <ClipboardIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-info">{counts.all}</p>
            <p className="text-xs text-neutral-70">Total Today</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-warning-soft text-warning">
            <ClockIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-warning">{counts.prescribed}</p>
            <p className="text-xs text-neutral-70">Prescribed</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-success-soft text-success">
            <CheckIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-success">{counts.dispensed}</p>
            <p className="text-xs text-neutral-70">Dispensed</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary">
            <BoxIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-primary">{counts.items}</p>
            <p className="text-xs text-neutral-70">Total Items</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
