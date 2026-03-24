import { format } from "date-fns";
import { Badge, Button, PageHeader } from "@/components/ui";
import type { Patient } from "@/services/patient.service";
import type { QueueEntry } from "@/services/queue.service";
import type { Visit } from "@/services/visit.service";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import {
  calculateAgeLabel,
  formatGenderLabel,
  initialsFromLabel
} from "@/features/consultation/utils/detail.utils";
import { ConsultationMetaItem } from "./consultation-meta-item";

interface ConsultationDetailHeaderCardProps {
  entry: QueueEntry;
  patient: Patient;
  visits: Visit[];
  elapsed: string;
  backLabel: string;
  onBack: () => void;
}

export function ConsultationDetailHeaderCard({
  entry,
  patient,
  visits,
  elapsed,
  backLabel,
  onBack
}: ConsultationDetailHeaderCardProps) {
  return (
    <div className="space-y-2">
      <Button size="sm" variant="text" intent="neutral" onClick={onBack} startIconName="arrowLeft">
        {backLabel}
      </Button>

      <PageHeader
        title="Consultation"
        subtitle={`Queue #${entry.queueNumber} - ${formatDoctorDisplayName(entry.doctorName)}`}
        iconName="activity"
        bodyClassName="p-0"
        action={
          <div className="flex items-center gap-2">
            <Badge tone={entry.status === "IN_PROGRESS" ? "info" : "warning"} withDot>
              {entry.status.replace("_", " ")}
            </Badge>
            <Badge tone="info">{elapsed}</Badge>
          </div>
        }
      >
        <div className="flex gap-10 bg-neutral-40/60 px-6 py-3">
          <div className="flex items-center gap-3 lg:col-span-2">
            <span className="inline-flex size-8 items-center justify-center rounded-xl bg-primary-soft text-sm font-bold text-primary">
              {initialsFromLabel(patient.fullName)}
            </span>
            <div>
              <p className="font-semibold text-neutral-95 text-sm">{patient.fullName}</p>
            </div>
          </div>

          <div className="flex items-center">
            <ConsultationMetaItem
              label="Age"
              value={calculateAgeLabel(patient.dateOfBirth)}
              valueClassName="text-xs text-neutral-90"
            />

            <ConsultationMetaItem
              label="Gender"
              value={formatGenderLabel(patient.gender)}
              valueClassName="text-xs font-medium text-neutral-90"
            />

            <ConsultationMetaItem label="Phone" value={patient.phone ?? "-"} />
            <ConsultationMetaItem
              label="DOB"
              value={
                patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMM d, yyyy") : "-"
              }
            />
            <ConsultationMetaItem
              label="Last Visit"
              value={
                visits[0]?.visitedAt ? format(new Date(visits[0].visitedAt), "MMM d, yyyy") : "-"
              }
            />
            <ConsultationMetaItem
              label="Status"
              value={patient.status}
              valueClassName="text-success"
            />
          </div>
        </div>
      </PageHeader>
    </div>
  );
}

