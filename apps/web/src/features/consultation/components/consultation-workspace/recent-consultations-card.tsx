import { format } from "date-fns";
import { Badge, Button, Card } from "@/components/ui";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import type { QueueEntry } from "@/services/queue.service";
import { formatQueueTicket } from "@/utils/queue-ticket";

interface RecentConsultationsCardProps {
  rows: QueueEntry[];
}

export function RecentConsultationsCard({ rows }: RecentConsultationsCardProps) {
  const settingsQuery = useTenantSettings();
  return (
    <Card className="overflow-hidden ">
      <Card.Header
        title="Recent"
        subtitle="Today's completed"
        iconName="check"
        iconClassName="bg-success-soft text-success"
        action={
          <Badge tone="success" size="sm">
            {rows.length} done
          </Badge>
        }
        className="border-b border-subtle"
      />
      <Card.Body className="space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-neutral-70">No completed consultations today.</p>
        ) : (
          <div className="space-y-2">
            {rows.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="rounded-md  bg-neutral-40 border border-neutral-40/99 px-4 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-95">{entry.patientName}</p>
                  <p className="text-2xs text-primary">
                    {entry.completedAt ? format(new Date(entry.completedAt), "h:mm a") : "-"}
                  </p>
                </div>

                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="text-2xs text-neutral-70">{formatQueueTicket(entry.queueNumber, settingsQuery.data?.queue)}</p>
                  <Badge tone="success" size="sm">
                    DONE
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full">
          <Button
            className="w-full"
            size="sm"
            variant="outlined"
            intent="neutral"
            startIconName="clipboardList"
          >
            View All Consultations
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}


