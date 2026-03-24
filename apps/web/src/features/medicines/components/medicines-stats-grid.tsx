import { Card } from "@/components/ui";
import { iconMap } from "@/config/icons";

interface MedicinesStatsGridProps {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export function MedicinesStatsGrid({
  total,
  inStock,
  lowStock,
  outOfStock
}: MedicinesStatsGridProps) {
  const BoxIcon = iconMap.calendarDays;
  const CheckIcon = iconMap.check;
  const WarningIcon = iconMap.clock3;
  const OutIcon = iconMap.x;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary">
            <BoxIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-primary">{total}</p>
            <p className="text-xs text-neutral-70">Total Medicines</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-success-soft text-success">
            <CheckIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-success">{inStock}</p>
            <p className="text-xs text-neutral-70">In Stock</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-warning-soft text-warning">
            <WarningIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-warning">{lowStock}</p>
            <p className="text-xs text-neutral-70">Low Stock</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-danger-soft text-danger">
            <OutIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-danger">{outOfStock}</p>
            <p className="text-xs text-neutral-70">Out of Stock</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
