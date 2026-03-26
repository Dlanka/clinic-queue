import { Card } from "@/components/ui";
import { iconMap } from "@/config/icons";

type MembersStatsGridProps = {
  total: number;
  active: number;
  invited: number;
  disabled: number;
};

export function MembersStatsGrid({ total, active, invited, disabled }: MembersStatsGridProps) {
  const UsersIcon = iconMap.users;
  const CheckIcon = iconMap.check;
  const ClockIcon = iconMap.clock3;
  const LockIcon = iconMap.lock;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <Card.Body className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary">
            <UsersIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-primary">{total}</p>
            <p className="text-xs text-neutral-70">Total Members</p>
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
          <span className="grid size-10 place-items-center rounded-md bg-warning-soft text-warning">
            <ClockIcon size={18} />
          </span>
          <div>
            <p className="text-xl font-bold text-warning">{invited}</p>
            <p className="text-xs text-neutral-70">Invited</p>
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
    </div>
  );
}

