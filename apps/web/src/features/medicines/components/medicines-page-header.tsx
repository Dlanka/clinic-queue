import { Button } from "@/components/ui";

type MedicinesPageHeaderProps = {
  onCreate: () => void;
};

export function MedicinesPageHeader({ onCreate }: MedicinesPageHeaderProps) {
  return (
    <section className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-95">Medicines</h1>
        <p className="text-sm text-neutral-80">Manage tenant medicine catalog and stock levels.</p>
      </div>
      <Button startIconName="plus" onClick={onCreate}>
        New Medicine
      </Button>
    </section>
  );
}
