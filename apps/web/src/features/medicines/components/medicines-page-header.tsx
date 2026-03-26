import { format } from "date-fns";
import { Button, PageHeader } from "@/components/ui";

type MedicinesPageHeaderProps = {
  onCreate: () => void;
};

export function MedicinesPageHeader({ onCreate }: MedicinesPageHeaderProps) {
  return (
    <PageHeader
      title="Medicines"
      subtitle={`Manage tenant medicine catalog and stock levels · ${format(new Date(), "MMM d, yyyy")}`}
      iconName="flaskConical"
      iconClassName="bg-primary-soft text-primary"
      action={
        <Button startIconName="plus" onClick={onCreate}>
          New Medicine
        </Button>
      }
    />
  );
}
