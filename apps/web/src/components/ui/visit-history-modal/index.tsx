import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  CollapsibleSection,
  RightPanelModal,
  SectionDivider,
  VitalMetricCard
} from "@/components/ui";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import type { Prescription } from "@/services/prescription.service";
import type { Visit } from "@/services/visit.service";

type VisitHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  patientName: string;
  visits: Visit[];
  prescriptions: Prescription[];
  loading?: boolean;
};

function ReadOnlyField({
  label,
  iconName,
  value
}: {
  label: string;
  iconName: "activity" | "clipboardList" | "menu";
  value?: string;
}) {
  return (
    <div className="space-y-1.5">
      <SectionDivider
        label={label}
        iconName={iconName}
        showLeadingLine={false}
        showTrailingLine={false}
        className="w-full"
      />
      <div className="rounded-md border border-subtle bg-neutral-20/70 px-4 py-3 text-sm text-neutral-90">
        {value?.trim() ? value : "-"}
      </div>
    </div>
  );
}

export function VisitHistoryModal({
  open,
  onClose,
  patientName,
  visits,
  prescriptions,
  loading = false
}: VisitHistoryModalProps) {
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setExpandedVisitId(visits[0]?.id ?? null);
  }, [open, visits]);

  const medicinesByVisitId = useMemo(() => {
    const map = new Map<string, Prescription["items"]>();
    for (const prescription of prescriptions) {
      const existing = map.get(prescription.visitId) ?? [];
      map.set(prescription.visitId, [...existing, ...prescription.items]);
    }
    return map;
  }, [prescriptions]);

  return (
    <RightPanelModal
      open={open}
      onClose={onClose}
      title="Visit History"
      description={`${patientName} · All previous visits`}
      iconName="calendarDays"
      variant="info"
      panelClassName="max-w-lg"
      titleBadge={
        <Badge tone="info" size="sm">
          {visits.length} visits
        </Badge>
      }
      footer={null}
    >
      {loading ? (
        <p className="text-sm text-neutral-70">Loading visit history...</p>
      ) : visits.length === 0 ? (
        <p className="text-sm text-neutral-70">No previous visits.</p>
      ) : (
        <div className="space-y-2">
          {visits.map((visit) => {
            const openVisit = expandedVisitId === visit.id;
            const medicines = medicinesByVisitId.get(visit.id) ?? [];

            return (
              <CollapsibleSection
                key={visit.id}
                label={
                  <div className="flex gap-2 items-center">
                    <span className="font-bold flex items-center gap-2">
                      <span className="size-2.5 rounded-full border border-primary flex items-center justify-center after:content-around after:bg-primary after:size-1 after:block after:rounded-full"></span>
                      {format(new Date(visit.visitedAt), "MMM d, yyyy · h:mm a")}
                    </span>
                    <span className="text-neutral-70 text-2xs">
                      {formatDoctorDisplayName(visit.doctorName)}
                    </span>
                  </div>
                }
                // iconName="clock3"
                open={openVisit}
                onToggle={() => setExpandedVisitId((prev) => (prev === visit.id ? null : visit.id))}
                // className="rounded-xl border-subtle"
                // headerClassName="bg-primary-soft/35"
                contentClassName="space-y-4"
              >
                {/* <div className="flex items-center justify-end">
                  <Badge tone="neutral" size="sm">
                    {visitDurationLabel(visit.visitedAt)}
                  </Badge>
                </div> */}

                <ReadOnlyField label="Symptoms" iconName="activity" value={visit.symptoms} />

                <div className="border-b border-subtle"></div>

                <ReadOnlyField label="Diagnosis" iconName="clipboardList" value={visit.diagnosis} />

                <div className="border-b border-subtle"></div>

                <ReadOnlyField label="Notes" iconName="menu" value={visit.notes} />

                <div className="border-b border-subtle"></div>

                <div className="space-y-2">
                  <SectionDivider
                    label="Vitals"
                    iconName="heart"
                    showLeadingLine={false}
                    showTrailingLine={false}
                    className="w-full"
                  />
                  <div className="grid gap-2 md:grid-cols-2">
                    <VitalMetricCard
                      label="BP"
                      iconName="heart"
                      unit="mmHg"
                      valueSlot={
                        <p className="text-xl font-bold text-neutral-95">
                          {visit.bloodPressure || "-"}
                        </p>
                      }
                    />
                    <VitalMetricCard
                      label="Pulse"
                      iconName="clock3"
                      unit="bpm"
                      valueSlot={
                        <p className="text-xl font-bold text-neutral-95">{visit.pulse ?? "-"}</p>
                      }
                    />
                    <VitalMetricCard
                      label="Temp"
                      iconName="thermometer"
                      unit="°F"
                      valueSlot={
                        <p className="text-xl font-bold text-neutral-95">
                          {visit.temperature ?? "-"}
                        </p>
                      }
                    />
                    <VitalMetricCard
                      label="Weight"
                      iconName="weight"
                      unit="kg"
                      valueSlot={
                        <p className="text-xl font-bold text-neutral-95">{visit.weight ?? "-"}</p>
                      }
                    />
                  </div>
                </div>

                <div className="border-b border-subtle"></div>

                <div className="space-y-2">
                  <SectionDivider
                    label="Medicines"
                    iconName="table-2"
                    showLeadingLine={false}
                    showTrailingLine={false}
                    className="w-full"
                  />
                  {medicines.length === 0 ? (
                    <p className="text-xs text-neutral-70">No medicines linked to this visit.</p>
                  ) : (
                    medicines.map((item, index) => (
                      <div
                        key={`${visit.id}-${item.medicineId}-${index}`}
                        className="flex flex-col gap-2 rounded-md border border-subtle bg-neutral-30 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-soft text-2xs font-semibold text-success">
                            {index + 1}
                          </span>
                          <p className="text-xs font-semibold text-neutral-90">
                            {item.medicineName}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 px-6">
                          {item.dosage ? (
                            <Badge tone="neutral" size="sm" variant="capitalize">
                              {item.dosage}
                            </Badge>
                          ) : null}
                          {item.frequency ? (
                            <Badge tone="neutral" size="sm" variant="capitalize">
                              {item.frequency}
                            </Badge>
                          ) : null}
                          {item.duration ? (
                            <Badge tone="neutral" size="sm" variant="capitalize">
                              {item.duration}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CollapsibleSection>
            );
          })}
        </div>
      )}
    </RightPanelModal>
  );
}

