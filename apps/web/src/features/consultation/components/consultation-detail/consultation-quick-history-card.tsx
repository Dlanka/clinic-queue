import { format } from "date-fns";
import { Badge, Button, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Prescription } from "@/services/prescription.service";
import type { Visit } from "@/services/visit.service";

interface ConsultationQuickHistoryCardProps {
  visits: Visit[];
  prescriptions: Prescription[];
  historyLoading: boolean;
  queueNotes?: string;
}

export function ConsultationQuickHistoryCard({
  visits,
  prescriptions,
  historyLoading,
  queueNotes
}: ConsultationQuickHistoryCardProps) {
  const visibleVisits = visits.slice(0, 2);

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Quick History"
        subtitle="Recent visits & prescriptions"
        iconName="clipboardList"
        iconClassName="bg-tertiary-soft text-tertiary"
        className="border-b border-subtle"
      />
      <Card.Body className="space-y-4">
        {queueNotes ? (
          <div className="rounded-lg border border-danger/30 bg-danger-soft/15 px-3 py-2 text-sm text-danger">
            <p className="font-semibold">Allergy on record</p>
            <p className="text-xs text-neutral-90">{queueNotes}</p>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-2xs font-semibold uppercase tracking-section text-neutral-70">
            Previous Visits
          </p>

          {historyLoading ? (
            <p className="text-sm text-neutral-70">Loading history...</p>
          ) : visits.length === 0 ? (
            <p className="text-sm text-neutral-70">No previous visits.</p>
          ) : (
            visibleVisits.map((visit, index) => (
              <div key={visit.id} className="relative pl-6">
                <span
                  className={cn(
                    "absolute left-1.5 top-2 w-px bg-subtle",
                    index === visibleVisits.length - 1 ? "bottom-3" : "-bottom-3"
                  )}
                />
                <span className="absolute left-0 top-1.5 size-3 rounded-full border-2 border-primary bg-neutral-40 shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]" />

                <div className="cursor-pointer rounded-md border border-subtle px-3 py-3 hover:bg-neutral-40">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-2xs font-semibold text-primary">
                      {format(new Date(visit.visitedAt), "MMM d, yyyy")}
                    </p>
                    <p className="text-2xs text-neutral-70">{visit.doctorName}</p>
                  </div>
                  <p className="mt-1 text-sm line-clamp-1 font-semibold text-neutral-95">
                    {visit.diagnosis || "General consultation"}
                  </p>
                  <p className="line-clamp-2 text-xs text-neutral-70">{visit.symptoms}</p>
                </div>
              </div>
            ))
          )}

          <div className="pt-2">
            <Button
              type="button"
              size="sm"
              variant="outlined"
              intent="neutral"
              startIconName="list"
              className="w-full"
            >
              View All Visits
            </Button>
          </div>
        </div>

        <div className="w-full border border-subtle"></div>

        <div className="space-y-2">
          <p className="text-2xs font-semibold uppercase tracking-section text-neutral-70">
            Previous Prescriptions
          </p>

          <div className="space-y-2">
            {prescriptions.length === 0 ? (
              <p className="text-sm text-neutral-70">No prescriptions.</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.slice(0, 2).map((prescription) => (
                  <div key={prescription.id} className="space-y-1.5">
                    <p className="text-2xs font-semibold uppercase tracking-section text-neutral-70">
                      {format(new Date(prescription.createdAt), "MMM d, yyyy")}
                    </p>

                    <div className="overflow-hidden rounded-md border border-subtle bg-neutral-40/30">
                      {prescription.items.slice(0, 2).map((item, itemIndex) => (
                        <div key={`${prescription.id}-${item.medicineId}`}>
                          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                            <div className="flex min-w-0 items-center gap-2.5">
                              {/* <span className="grid size-8 shrink-0 place-items-center rounded-md bg-success-soft/25 text-success">
                                <span className="text-xs font-bold">+</span>
                              </span> */}
                              <p className="line-clamp-2 text-xs font-semibold leading-tight text-neutral-90">
                                {item.medicineName}
                              </p>
                            </div>

                            <div className="flex min-w-0 items-center gap-1.5 text-2xs text-neutral-70">
                              <span className="truncate">
                                {[item.dosage, item.frequency, item.duration]
                                  .filter(Boolean)
                                  .join(" · ") || "-"}
                              </span>
                              {prescription.status !== "DISPENSED" ? (
                                <Badge tone="warning" size="sm">
                                  Ongoing
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                          {itemIndex < Math.min(prescription.items.length, 2) - 1 ? (
                            <span className="block h-px bg-subtle" />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="button"
              size="sm"
              variant="outlined"
              intent="neutral"
              startIconName="list"
              className="w-full"
            >
              View All Prescriptions
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
