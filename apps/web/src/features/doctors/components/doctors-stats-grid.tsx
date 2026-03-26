import { Card } from "@/components/ui";
import { iconMap } from "@/config/icons";

type DoctorsStatsGridProps = {
  total: number;
  active: number;
  disabled: number;
  withLicense: number;
};

export function DoctorsStatsGrid({
  total,
  active,
  disabled,
  withLicense
}: DoctorsStatsGridProps) {
  const UsersIcon = iconMap.users;
  const CheckIcon = iconMap.check;
  const LockIcon = iconMap.lock;
  const ListIcon = iconMap.list;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary">
            <UsersIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-primary">{total}</p>
            <p className="text-xs text-neutral-70">Total Doctors</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-success-soft text-success">
            <CheckIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-success">{active}</p>
            <p className="text-xs text-neutral-70">Active</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-danger-soft text-danger">
            <LockIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-danger">{disabled}</p>
            <p className="text-xs text-neutral-70">Disabled</p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-info-soft text-info">
            <ListIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-info">{withLicense}</p>
            <p className="text-xs text-neutral-70">With License</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

