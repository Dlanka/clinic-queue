import { differenceInYears, format } from "date-fns";
import { useMemo, useState } from "react";
import { iconMap } from "@/config/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  SectionDivider
} from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Patient } from "@/services/patient.service";
import type { Prescription, PrescriptionItem } from "@/services/prescription.service";
import type { Visit } from "@/services/visit.service";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import { PatientDetailInfoCell } from "./patient-detail-info-cell";
import { PatientVitalCard } from "./patient-vital-card";
import { PatientVisitTextSection } from "./patient-visit-text-section";

const VisitHistoryIcon = iconMap.clipboardList;

type PatientDetailCardProps = {
  patient: Patient | null;
  visits: Visit[];
  prescriptions: Prescription[];
  visitsLoading: boolean;
  onEdit: (patient: Patient) => void;
  onDeactivate: (patientId: string) => void;
  isDeactivating: boolean;
};

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

function groupPrescriptionItemsByVisit(prescriptions: Prescription[]) {
  const map = new Map<string, PrescriptionItem[]>();

  for (const prescription of prescriptions) {
    const previousItems = map.get(prescription.visitId) ?? [];
    map.set(prescription.visitId, [...previousItems, ...prescription.items]);
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

  const prescriptionItemsByVisit = useMemo(
    () => groupPrescriptionItemsByVisit(prescriptions),
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

  const activeVisitId = expandedVisitId;
  const lastVisit = visits[0];

  return (
    <Card className="overflow-hidden">
      <Card.Body className="space-y-0 p-0">
        <div className="border-b border-subtle px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={patient.fullName} size="lg" className="shrink-0" />

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-neutral-95">{patient.fullName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-70">
                  <span>{genderLabel(patient.gender)}</span>
                  <span>-</span>
                  <span>{calculateAge(patient.dateOfBirth)}</span>
                  <span>-</span>
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
              <Button
                size="sm"
                variant="tonal"
                intent="info"
                startIconName="squarePen"
                onClick={() => onEdit(patient)}
              >
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

        <div className="scrollbar-thin-minimal xl:max-h-[calc(100vh-22rem)] xl:overflow-y-auto">
          <div className="grid gap-0 border-b border-subtle bg-neutral-20 sm:grid-cols-2 lg:grid-cols-6">
            <PatientDetailInfoCell
              label="DOB"
              value={
                patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMM d, yyyy") : "-"
              }
            />
            <PatientDetailInfoCell label="Age" value={calculateAge(patient.dateOfBirth)} />
            <PatientDetailInfoCell label="Gender" value={genderLabel(patient.gender)} />
            <PatientDetailInfoCell label="Total Visits" value={String(visits.length)} />
            <PatientDetailInfoCell
              label="Last Visit"
              value={lastVisit ? format(new Date(lastVisit.visitedAt), "MMM d, yyyy") : "-"}
            />
            <PatientDetailInfoCell
              label="Status"
              value={patient.status === "ACTIVE" ? "Active" : "Inactive"}
              valueClassName={patient.status === "ACTIVE" ? "text-success" : "text-danger"}
            />
          </div>

          <div className="px-5 py-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex size-4 items-center justify-center">
                <VisitHistoryIcon size={16} />
              </span>
              <p className="text-sm font-semibold text-neutral-95">Visit History</p>
              <Badge tone="info" size="sm">
                {visits.length} visits
              </Badge>
            </div>

            {visitsLoading ? (
              <p className="text-sm text-neutral-70">Loading visits...</p>
            ) : visits.length === 0 ? (
              <EmptyState
                title="No visits yet"
                description="This patient does not have consultation records yet."
                iconName="clipboardList"
                className="min-h-56"
              />
            ) : (
              <div className="space-y-3">
                {visits.map((visit, index) => {
                  const expanded = activeVisitId === visit.id;
                  const medicineItems = prescriptionItemsByVisit.get(visit.id) ?? [];
                  const isLastVisit = index === visits.length - 1;

                  return (
                    <div key={visit.id} className="relative pl-6">
                      <span
                        className={cn(
                          "absolute left-1.5 top-3 w-px bg-subtle",
                          isLastVisit ? "bottom-3" : "-bottom-3"
                        )}
                      />
                      <span className="absolute left-0 top-2.5 size-3 rounded-full border-2 border-primary bg-neutral-20 shadow-[0_0_8px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]" />

                      <div className="rounded-md border border-subtle">
                        <div
                          role="button"
                          tabIndex={0}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-md bg-primary-soft/40 px-4 py-3 text-left transition-colors",
                            expanded ? "rounded-b-none" : "hover:bg-primary-soft/60"
                          )}
                          onClick={() =>
                            setExpandedVisitId((prev) => (prev === visit.id ? null : visit.id))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setExpandedVisitId((prev) => (prev === visit.id ? null : visit.id));
                            }
                          }}
                        >
                          <div className="min-w-0 flex gap-2">
                            <p className="truncate text-sm font-semibold text-primary">
                              {format(new Date(visit.visitedAt), "MMM d, yyyy - h:mm a")}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-neutral-70">
                              {formatDoctorDisplayName(visit.doctorName)}
                            </p>
                          </div>

                          <IconButton
                            type="button"
                            size="sm"
                            variant="tonal"
                            intent="neutral"
                            iconName={expanded ? "chevronUp" : "chevronDown"}
                            iconSize={16}
                            aria-label={
                              expanded ? "Collapse visit details" : "Expand visit details"
                            }
                            className="pointer-events-none"
                          />
                        </div>

                        {expanded ? (
                          <div className="space-y-4 border-t border-subtle bg-neutral-40/30 px-4 py-4">
                            <PatientVisitTextSection
                              title="Symptoms"
                              iconName="activity"
                              value={visit.symptoms}
                            />

                            <div className="border-b border-subtle"></div>

                            <PatientVisitTextSection
                              title="Diagnosis"
                              iconName="clipboardList"
                              value={visit.diagnosis}
                            />

                            <div className="border-b border-subtle"></div>

                            <PatientVisitTextSection
                              title="Notes"
                              iconName="menu"
                              value={visit.notes}
                            />

                            <div className="border-b border-subtle"></div>

                            <div className="space-y-2">
                              <SectionDivider
                                label="Vitals"
                                iconName="heart"
                                showLeadingLine={false}
                                showTrailingLine={false}
                                className="w-full"
                              />
                              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                                <PatientVitalCard
                                  label="BP"
                                  iconName="heart"
                                  iconClassName="text-danger"
                                  value={visit.bloodPressure || "-"}
                                  unit="mmHg"
                                  stateLabel={vitalState(visit.bloodPressure).label}
                                  stateTone={vitalState(visit.bloodPressure).tone}
                                />
                                <PatientVitalCard
                                  label="Pulse"
                                  iconName="clock3"
                                  iconClassName="text-warning"
                                  value={visit.pulse ?? "-"}
                                  unit="bpm"
                                  stateLabel={vitalState(visit.pulse).label}
                                  stateTone={vitalState(visit.pulse).tone}
                                />
                                <PatientVitalCard
                                  label="Temp"
                                  iconName="thermometer"
                                  iconClassName="text-tertiary"
                                  value={visit.temperature ?? "-"}
                                  unit="degF"
                                  stateLabel={vitalState(visit.temperature).label}
                                  stateTone={vitalState(visit.temperature).tone}
                                />
                                <PatientVitalCard
                                  label="Weight"
                                  iconName="weight"
                                  iconClassName="text-success"
                                  value={visit.weight ?? "-"}
                                  unit="kg"
                                  stateLabel={vitalState(visit.weight).label}
                                  stateTone={vitalState(visit.weight).tone}
                                />
                              </div>
                            </div>

                            <div className="border-b border-subtle"></div>

                            <div className="space-y-2">
                              <SectionDivider
                                label="Medicines Prescribed"
                                iconName="table-2"
                                showLeadingLine={false}
                                showTrailingLine={false}
                                className="w-full"
                              />
                              {medicineItems.length === 0 ? (
                                <p className="text-xs text-neutral-70">
                                  No prescription linked to this visit.
                                </p>
                              ) : (
                                <div className="space-y-1.5">
                                  {medicineItems.map((item, index) => (
                                    <div
                                      key={`${visit.id}-${item.medicineId}-${index}`}
                                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-subtle bg-neutral-30 px-4 py-3"
                                    >
                                      <p className="text-sm font-semibold text-neutral-90">
                                        {item.medicineName}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
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
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
