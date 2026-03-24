import { Button, Badge, Card } from "@/components/ui";
import type { QueueEntry } from "@/services/queue.service";
import { formatDoctorDisplayName } from "@/utils/doctor-name";

interface ConsultationTopBarProps {
  entry: QueueEntry;
  doctorName: string;
  patientName: string;
  backLabel?: string;
  onBack: () => void;
}

export function ConsultationTopBar({
  entry,
  doctorName,
  patientName,
  backLabel = "Back to Queue",
  onBack
}: ConsultationTopBarProps) {
  return (
    <Card>
      <Card.Body className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <Button size="sm" variant="text" intent="neutral" onClick={onBack}>
            {backLabel}
          </Button>
          <h1 className="text-2xl font-bold text-neutral-95">Consultation</h1>
          <p className="text-sm text-neutral-70">
            Queue #{entry.queueNumber} - {formatDoctorDisplayName(doctorName)} - {patientName}
          </p>
        </div>

        <Badge
          tone={
            entry.status === "COMPLETED"
              ? "success"
              : entry.status === "CANCELLED"
                ? "danger"
                : entry.status === "IN_PROGRESS"
                  ? "info"
                  : "warning"
          }
        >
          {entry.status.replace("_", " ")}
        </Badge>
      </Card.Body>
    </Card>
  );
}

