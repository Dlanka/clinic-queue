import { Button } from "@/components/ui";

export function MembersPageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-95">Members</h1>
        <p className="text-sm text-neutral-80">Manage tenant memberships and role assignments.</p>
      </div>
      <Button startIconName="plus" onClick={onCreate}>
        New Member
      </Button>
    </section>
  );
}
