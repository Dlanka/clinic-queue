import { Button } from "@/components/ui";

type PatientsPageHeaderProps = {
  onCreate: () => void;
};

export function PatientsPageHeader({ onCreate }: PatientsPageHeaderProps) {
  return (
    <section className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-95">Patients</h1>
        <p className="text-sm text-neutral-80">Manage patient registry and clinical visit history.</p>
      </div>
      <Button startIconName="plus" onClick={onCreate}>
        New Patient
      </Button>
    </section>
  );
}
