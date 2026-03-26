import { format } from "date-fns";
import { Button, PageHeader } from "@/components/ui";

type DoctorsPageHeaderProps = {
  onCreate: () => void;
};

export function DoctorsPageHeader({ onCreate }: DoctorsPageHeaderProps) {
  return (
    <PageHeader
      title="Doctors"
      subtitle={`Manage tenant doctors and their specialties · ${format(new Date(), "MMM d, yyyy")}`}
      iconName="stethoscope"
      iconClassName="bg-primary-soft text-primary"
      action={
        <Button startIconName="plus" onClick={onCreate}>
          New Doctor
        </Button>
      }
    />
  );
}
