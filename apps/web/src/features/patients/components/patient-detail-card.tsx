import { differenceInYears, format } from "date-fns";
import { useMemo, useState } from "react";
import { Badge, Button, Card, EmptyState, SectionDivider } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Patient } from "@/services/patient.service";
import type { Prescription, PrescriptionItem } from "@/services/prescription.service";
import type { Visit } from "@/services/visit.service";

type PatientDetailCardProps = {
  patient: Patient | null;
  visits: Visit[];
  prescriptions: Prescription[];
  visitsLoading: boolean;
  onEdit: (patient: Patient) => void;
  onDeactivate: (patientId: string) => void;
  isDeactivating: boolean;
};

function initialsFromName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "NA";
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function genderLabel(value?: Patient["gender"]) {
  if (!value) {
    return "N/A";
  }
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function calculateAge(dob?: string) {
  if (!dob) {
    return "-";
  }
  return `${differenceInYears(new Date(), new Date(dob))} yrs`;
}

function vitalState(value: number | string | undefined) {
  if (!value && value !== 0) {
    return { label: "Not set", tone: "neutral" as const };
  }
  return { label: "Normal", tone: "success" as const };
}

function groupedPrescriptionsByVisit(prescriptions: Prescription[]) {
  const map = new Map<string, PrescriptionItem[]>();
  for (const prescription of prescriptions) {
    const previous = map.get(prescription.visitId) ?? [];
    map.set(prescription.visitId, [...previous, ...prescription.items]);
  }
  return map;
}

export function PatientDetailCard({
  patient,
  visits,
  prescriptions,
  visitsLoading,
  onEdit,
  onDeactivate,
  isDeactivating
}: PatientDetailCardProps) {
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);
  const prescriptionsByVisit = useMemo(
    () => groupedPrescriptionsByVisit(prescriptions),
    [prescriptions]
  );

  if (!patient) {
    return (
      <Card>
        <Card.Body>
          <EmptyState
            title="No patient selected"
            description="Pick a patient from the registry to view profile and visit history."
            iconName="user"
            className="min-h-[60vh]"
          />
        </Card.Body>
      </Card>
    );
  }

  const activeVisitId = expandedVisitId ?? visits[0]?.id ?? null;
  const lastVisit = visits[0];

  return (
    <Card className="overflow-hidden">
      <Card.Body className="space-y-0 p-0">
        <div className="border-b border-subtle px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-lg font-bold text-primary">
                {initialsFromName(patient.fullName)}
              </span>

              <div className="min-w-0">
                <p className="truncate text-2xl font-bold text-neutral-95">{patient.fullName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-70">
                  <span>{genderLabel(patient.gender)}</span>
                  <span>·</span>
                  <span>{calculateAge(patient.dateOfBirth)}</span>
                  <span>·</span>
                  <span>{patient.phone || "No phone"}</span>
                  {patient.status === "ACTIVE" ? (
                    <Badge tone="success" size="sm">
                      Active
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="tonal" intent="info" startIconName="squarePen" onClick={() => onEdit(patient)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="tonal"
                intent="danger"
                startIconName="trash2"
                disabled={isDeactivating}
                onClick={() => onDeactivate(patient.id)}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-0 border-b border-subtle sm:grid-cols-2 lg:grid-cols-6">
          <InfoCell label="DOB" value={patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMM d, yyyy") : "-"} />
          <InfoCell label="Age" value={calculateAge(patient.dateOfBirth)} />
          <InfoCell label="Gender" value={genderLabel(patient.gender)} />
          <InfoCell label="Total Visits" value={String(visits.length)} />
          <InfoCell
            label="Last Visit"
            value={lastVisit ? format(new Date(lastVisit.visitedAt), "MMM d, yyyy") : "-"}
          />
          <InfoCell
            label="Status"
            value={patient.status === "ACTIVE" ? "Active" : "Inactive"}
            valueClassName={patient.status === "ACTIVE" ? "text-success" : "text-danger"}
          />
        </div>

        <div className="px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <SectionDivider
              label="Visit History"
              iconName="clipboardList"
              showLeadingLine={false}
              className="w-full"
            />
            <Badge tone="info" size="sm">
              {visits.length} visits
            </Badge>
          </div>

          {visitsLoading ? (
            <p className="text-sm text-neutral-70">Loading visits...</p>
          ) : visits.length === 0 ? (
            <EmptyState
              title="No visits yet"
              description="This patient doesn't have consultation records yet."
              iconName="clipboardList"
              className="min-h-56"
            />
          ) : (
            <div className="space-y-3">
              {visits.map((visit) => {
                const expanded = activeVisitId === visit.id;
                const medicineItems = prescriptionsByVisit.get(visit.id) ?? [];

                return (
                  <div key={visit.id} className="rounded-xl border border-subtle bg-neutral-20/70">
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                        expanded ? "bg-primary-soft/20" : "hover:bg-neutral-30"
                      )}
                      onClick={() => setExpandedVisitId((prev) => (prev === visit.id ? null : visit.id))}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-primary">
                          {format(new Date(visit.visitedAt), "MMM d, yyyy · h:mm a")}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-neutral-70">{visit.doctorName}</p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-70">
                        <span className="inline-flex items-center gap-1">
                          <span className="text-neutral-60">◷</span>
                          {format(new Date(visit.visitedAt), "h:mm a")}
                        </span>
                        <span className={cn("transition-transform", expanded ? "rotate-90" : "")}>›</span>
                      </div>
                    </button>

                    {expanded ? (
                      <div className="space-y-3 border-t border-subtle px-4 py-4">
                        <VisitTextSection title="Symptoms" iconName="activity" value={visit.symptoms} />
                        <VisitTextSection title="Diagnosis" iconName="clipboardList" value={visit.diagnosis} />
                        <VisitTextSection title="Notes" iconName="menu" value={visit.notes} />

                        <div className="space-y-2">
                          <SectionDivider
                            label="Vitals"
                            iconName="heart"
                            showLeadingLine={false}
                            className="w-full"
                          />
                          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                            <VitalCard label="BP" value={visit.bloodPressure || "-"} unit="mmHg" />
                            <VitalCard label="Pulse" value={visit.pulse ?? "-"} unit="bpm" />
                            <VitalCard label="Temp" value={visit.temperature ?? "-"} unit="�degF" />
                            <VitalCard label="Weight" value={visit.weight ?? "-"} unit="kg" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <SectionDivider
                            label="Medicines Prescribed"
                            iconName="table-2"
                            showLeadingLine={false}
                            className="w-full"
                          />
                          {medicineItems.length === 0 ? (
                            <p className="text-xs text-neutral-70">No prescription linked to this visit.</p>
                          ) : (
                            <div className="space-y-1.5">
                              {medicineItems.map((item, index) => (
                                <div
                                  key={`${visit.id}-${item.medicineId}-${index}`}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-subtle bg-neutral-30 px-3 py-2"
                                >
                                  <p className="text-sm font-semibold text-neutral-95">{item.medicineName}</p>
                                  <div className="flex flex-wrap gap-1">
                                    <Badge tone="info" size="sm">
                                      {item.quantity} units
                                    </Badge>
                                    {item.dosage ? (
                                      <Badge tone="neutral" size="sm">
                                        {item.dosage}
                                      </Badge>
                                    ) : null}
                                    {item.frequency ? (
                                      <Badge tone="neutral" size="sm">
                                        {item.frequency}
                                      </Badge>
                                    ) : null}
                                    {item.duration ? (
                                      <Badge tone="neutral" size="sm">
                                        {item.duration}
                                      </Badge>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

function InfoCell({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="border-t border-subtle px-4 py-3 sm:border-r sm:first:border-t-0 lg:border-t-0">
      <p className="text-2xs uppercase tracking-section text-neutral-70">{label}</p>
      <p className={cn("text-lg font-semibold text-neutral-95", valueClassName)}>{value}</p>
    </div>
  );
}

function VisitTextSection({
  title,
  iconName,
  value
}: {
  title: string;
  iconName: "activity" | "clipboardList" | "menu";
  value?: string;
}) {
  return (
    <div className="space-y-1.5">
      <SectionDivider label={title} iconName={iconName} showLeadingLine={false} className="w-full" />
      <div className="rounded-lg border border-subtle bg-neutral-30 px-3 py-2 text-sm text-neutral-90">
        {value?.trim() ? value : "-"}
      </div>
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit
}: {
  label: string;
  value: string | number;
  unit: string;
}) {
  const state = vitalState(value);
  return (
    <div className="rounded-lg border border-subtle bg-neutral-30 px-3 py-2">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-2xs uppercase tracking-section text-neutral-70">{label}</p>
        <Badge tone={state.tone} size="sm">
          {state.label}
        </Badge>
      </div>
      <p className="text-xl font-semibold text-neutral-95">{value}</p>
      <p className="text-xs text-neutral-70">{unit}</p>
    </div>
  );
}

