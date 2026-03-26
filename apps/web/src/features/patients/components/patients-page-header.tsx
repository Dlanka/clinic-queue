import { format } from "date-fns";
import { Button, PageHeader } from "@/components/ui";

type PatientsPageHeaderProps = {
  title?: string;
  subtitle?: string;
  createLabel?: string;
  hideCreateButton?: boolean;
  patientCount?: number;
  onCreate: () => void;
};

export function PatientsPageHeader({
  title = "Patients",
  subtitle = "Manage patient registry and clinical visit history.",
  createLabel = "New Patient",
  hideCreateButton = false,
  patientCount = 0,
  onCreate
}: PatientsPageHeaderProps) {
  return (
    <PageHeader
      title={title}
      subtitle={`${subtitle} · ${patientCount} patient${patientCount === 1 ? "" : "s"} · ${format(new Date(), "MMM d, yyyy")}`}
      iconName="users"
      iconClassName="bg-primary-soft text-primary"
      action={
        hideCreateButton ? null : (
          <Button startIconName="plus" onClick={onCreate}>
            {createLabel}
          </Button>
        )
      }
    />
  );
}
