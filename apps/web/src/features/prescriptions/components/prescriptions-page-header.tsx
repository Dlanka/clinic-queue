import { format } from "date-fns";
import { Button, PageHeader } from "@/components/ui";

type PrescriptionsPageHeaderProps = {
  onNewPrescription?: () => void;
};

export function PrescriptionsPageHeader({ onNewPrescription }: PrescriptionsPageHeaderProps) {
  return (
    <PageHeader
      title="Prescriptions"
      subtitle={`Pharmacy view for dispensing and tracking prescriptions · ${format(new Date(), "MMM d, yyyy")}`}
      iconName="pill"
      iconClassName="bg-primary-soft text-primary"
      action={
        <Button startIconName="plus" onClick={onNewPrescription}>
          New Prescription
        </Button>
      }
    />
  );
}
