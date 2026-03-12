import { Button } from "@/components/ui";

type PrescriptionsPageHeaderProps = {
  selectedStatus: "ALL" | "PRESCRIBED" | "DISPENSED";
  onSelectStatus: (status: "ALL" | "PRESCRIBED" | "DISPENSED") => void;
};

export function PrescriptionsPageHeader({
  selectedStatus,
  onSelectStatus
}: PrescriptionsPageHeaderProps) {
  return (
    <section className="space-y-3">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-95">Prescriptions</h1>
        <p className="text-sm text-neutral-80">Pharmacy view for dispensing and tracking prescriptions.</p>
      </div>

      <div className="flex gap-2">
        {(["ALL", "PRESCRIBED", "DISPENSED"] as const).map((status) => (
          <Button
            key={status}
            intent={selectedStatus === status ? "primary" : "secondary"}
            size="sm"
            onClick={() => onSelectStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>
    </section>
  );
}
