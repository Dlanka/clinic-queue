import { format } from "date-fns";
import { Badge, Card } from "@/components/ui";
import type { Prescription } from "@/services/prescription.service";
import type { Visit } from "@/services/visit.service";

interface PatientHistoryCardProps {
  visits: Visit[];
  prescriptions: Prescription[];
  loading: boolean;
}

export function PatientHistoryCard({ visits, prescriptions, loading }: PatientHistoryCardProps) {
  return (
    <Card>
      <Card.Header
        title="Quick History"
        subtitle="Recent visits and prescription summary"
        iconName="clipboardList"
        iconClassName="bg-tertiary-soft text-tertiary"
      />
      <Card.Body className="space-y-3">
        {loading ? <p className="text-sm text-neutral-70">Loading history...</p> : null}

        {!loading && visits.length === 0 ? (
          <p className="text-sm text-neutral-70">No previous visits found.</p>
        ) : null}

        {visits.slice(0, 5).map((visit) => (
          <div key={visit.id} className="rounded-lg border border-subtle bg-neutral-20 p-3">
            <p className="text-xs text-neutral-70">{format(new Date(visit.visitedAt), "MMM d, yyyy h:mm a")}</p>
            <p className="mt-1 text-sm font-semibold text-neutral-95">{visit.diagnosis || "No diagnosis"}</p>
            <p className="text-xs text-neutral-80 line-clamp-2">{visit.symptoms}</p>
          </div>
        ))}

        <div className="border-t border-subtle pt-2">
          <p className="mb-2 text-xs uppercase text-neutral-70">Previous Prescriptions</p>
          {prescriptions.length === 0 ? (
            <p className="text-sm text-neutral-70">No previous prescriptions.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {prescriptions.slice(0, 6).map((prescription) => (
                <Badge key={prescription.id} tone={prescription.status === "DISPENSED" ? "success" : "warning"}>
                  {prescription.items.length} meds
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
