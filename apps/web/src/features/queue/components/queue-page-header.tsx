import { format } from "date-fns";
import { Badge, Button, PageHeader } from "@/components/ui";

interface QueuePageHeaderProps {
  autoRefresh: boolean;
  canAddToQueue: boolean;
  onCreate: () => void;
}

export function QueuePageHeader({ autoRefresh, canAddToQueue, onCreate }: QueuePageHeaderProps) {
  return (
    <PageHeader
      title="Queue"
      subtitle={`Daily doctor queue management - ${format(new Date(), "MMM d, yyyy")}`}
      iconName="clipboardList"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="capitalize" tone="success" withDot>
            {autoRefresh ? "Live - Auto-refresh 30s" : "Paused"}
          </Badge>

          {canAddToQueue ? (
            <Button startIconName="plus" onClick={onCreate}>
              Add To Queue
            </Button>
          ) : null}
        </div>
      }
    />
  );
}
