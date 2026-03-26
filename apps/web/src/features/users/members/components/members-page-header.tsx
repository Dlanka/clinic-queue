import { format } from "date-fns";
import { Button, PageHeader } from "@/components/ui";

export function MembersPageHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <PageHeader
      title="Members"
      subtitle={`Manage tenant memberships and role assignments · ${format(new Date(), "MMM d, yyyy")}`}
      iconName="shieldPlus"
      iconClassName="bg-primary-soft text-primary"
      action={
        <Button startIconName="plus" onClick={onCreate}>
          New Member
        </Button>
      }
    />
  );
}
