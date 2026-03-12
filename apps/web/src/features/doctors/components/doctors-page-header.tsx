import { Button } from "@/components/ui";

type DoctorsPageHeaderProps = {
  onCreate: () => void;
};

export function DoctorsPageHeader({ onCreate }: DoctorsPageHeaderProps) {
  return (
    <section className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-95">Doctors</h1>
        <p className="text-sm text-neutral-80">Manage tenant doctors and their specialties.</p>
      </div>
      <Button startIconName="plus" onClick={onCreate}>
        New Doctor
      </Button>
    </section>
  );
}
