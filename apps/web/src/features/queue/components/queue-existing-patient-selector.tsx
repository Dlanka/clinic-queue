import { differenceInYears } from "date-fns";
import { useMemo, useState } from "react";
import { Avatar, FieldGroup, Input } from "@/components/ui";
import type { Patient } from "@/services/patient.service";

interface QueueExistingPatientSelectorProps {
  patients: Patient[];
  patientsLoading: boolean;
  selectedPatientId?: string;
  error?: string;
  onSelectPatient: (patientId: string) => void;
}

function getPatientMeta(patient: Patient) {
  const parts: string[] = [];

  if (patient.phone) {
    parts.push(patient.phone);
  }

  if (patient.gender) {
    parts.push(patient.gender.charAt(0));
  }

  if (patient.dateOfBirth) {
    const years = differenceInYears(new Date(), new Date(patient.dateOfBirth));
    if (Number.isFinite(years) && years >= 0) {
      parts.push(`${years} yrs`);
    }
  }

  return parts.join(", ") || "No details";
}

export function QueueExistingPatientSelector({
  patients,
  patientsLoading,
  selectedPatientId,
  error,
  onSelectPatient
}: QueueExistingPatientSelectorProps) {
  const [patientSearch, setPatientSearch] = useState("");

  const filteredPatients = useMemo(() => {
    const term = patientSearch.trim().toLowerCase();

    const activePatients = patients.filter((patient) => patient.status === "ACTIVE");

    if (!term) {
      return activePatients.slice(0, 24);
    }

    return activePatients
      .filter((patient) => {
        return (
          patient.fullName.toLowerCase().includes(term) ||
          (patient.phone ?? "").toLowerCase().includes(term) ||
          patient.id.toLowerCase().includes(term)
        );
      })
      .slice(0, 24);
  }, [patientSearch, patients]);

  return (
    <div className="space-y-4">
      <FieldGroup id="queue-patient-search" label="Search Patient">
        <Input
          id="queue-patient-search"
          placeholder={patientsLoading ? "Loading patients..." : "Search by name, phone, or ID..."}
          startIconName="search"
          value={patientSearch}
          onChange={(event) => setPatientSearch(event.target.value)}
        />
      </FieldGroup>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-3xs font-semibold uppercase tracking-section text-neutral-70">
            Recent Patients
          </p>
          <p className="text-3xs text-neutral-70">
            Showing
            <span className="mx-1 font-semibold text-primary">{filteredPatients.length}</span>
            of
            <span className="ml-1 font-semibold">{patients.length}</span>
          </p>
        </div>

        <div className="relative">
          <div className="scrollbar-thin-minimal max-h-60 space-y-2 overflow-y-auto pr-1">
            {filteredPatients.length === 0 ? (
              <div className="rounded-md border border-subtle px-3 py-4 text-sm text-neutral-70">
                No matching patients found.
              </div>
            ) : (
              filteredPatients.map((patient) => {
                const selected = selectedPatientId === patient.id;

                return (
                  <button
                    key={patient.id}
                    type="button"
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
                      selected
                        ? "border-primary/30 bg-primary-soft/60"
                        : "border-subtle bg-neutral-30 hover:border-primary/35"
                    }`}
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    <Avatar name={patient.fullName} size="md" className="h-9 w-9 shrink-0 text-xs" />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-neutral-90">
                        {patient.fullName}
                      </span>
                      <span className="block truncate text-xs text-neutral-70">
                        {getPatientMeta(patient)}
                      </span>
                    </span>

                    {selected ? (
                      <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                        Selected
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
          <div className="scroll-fade-bottom" />
        </div>

        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    </div>
  );
}



