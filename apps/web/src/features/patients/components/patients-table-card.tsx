import { format } from "date-fns";
import { Badge, Card, Input } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Patient } from "@/services/patient.service";

type PatientsTableCardProps = {
  rows: Patient[];
  isLoading: boolean;
  selectedPatientId: string | null;
  searchTerm: string;
  onSearch: (value: string) => void;
  onSelect: (patientId: string) => void;
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

export function PatientsTableCard({
  rows,
  isLoading,
  selectedPatientId,
  searchTerm,
  onSearch,
  onSelect
}: PatientsTableCardProps) {
  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Patient Registry"
        subtitle={`${rows.length} patient${rows.length === 1 ? "" : "s"}`}
        iconName="user"
        iconClassName="bg-tertiary-soft text-tertiary"
        className="border-b border-subtle"
      />
      <Card.Body className="space-y-3 p-0">
        <div className="px-4 pt-3">
          <Input
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by name or phone..."
            rounded="full"
            size="sm"
            startIconName="search"
          />
        </div>

        <div className="scrollbar-thin-minimal max-h-[60vh] space-y-0.5 overflow-y-auto border-t border-subtle">
          {isLoading ? (
            <p className="px-4 py-4 text-sm text-neutral-70">Loading patients...</p>
          ) : rows.length === 0 ? (
            <p className="px-4 py-4 text-sm text-neutral-70">No patients found.</p>
          ) : (
            rows.map((patient) => {
              const selected = selectedPatientId === patient.id;

              return (
                <button
                  key={patient.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-3 border-b border-subtle px-4 py-3 text-left transition-colors",
                    selected
                      ? "border-l-2 border-l-primary bg-primary-soft/20"
                      : "hover:bg-neutral-30/70"
                  )}
                  onClick={() => onSelect(patient.id)}
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-bold text-primary">
                    {initialsFromName(patient.fullName)}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-semibold text-neutral-95">
                      {patient.fullName}
                    </span>
                    <span className="block truncate text-xs text-neutral-70">
                      {genderLabel(patient.gender)} ·{" "}
                      {patient.dateOfBirth
                        ? format(new Date(patient.dateOfBirth), "MMM d, yyyy")
                        : "No DOB"}{" "}
                      · {patient.phone || "No phone"}
                    </span>
                  </span>

                  <Badge tone={patient.status === "ACTIVE" ? "success" : "danger"} size="sm">
                    {patient.status === "ACTIVE" ? "Active" : "Inactive"}
                  </Badge>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-subtle px-4 py-3">
          <p className="text-xs text-neutral-70">
            {rows.length} patient{rows.length === 1 ? "" : "s"} ·{" "}
            {rows.every((row) => row.status === "ACTIVE") ? "All active" : "Mixed status"}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}
