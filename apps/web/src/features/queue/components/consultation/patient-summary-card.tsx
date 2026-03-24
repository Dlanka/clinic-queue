import { format } from "date-fns";
import { Badge, Card } from "@/components/ui";
import type { Patient } from "@/services/patient.service";

interface PatientSummaryCardProps {
  patient: Patient;
  queueNotes?: string;
}

function calculateAge(dob?: string) {
  if (!dob) {
    return "N/A";
  }

  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return `${age} yrs`;
}

export function PatientSummaryCard({ patient, queueNotes }: PatientSummaryCardProps) {
  return (
    <Card>
      <Card.Header
        title="Patient Summary"
        subtitle={patient.fullName}
        iconName="user"
        iconClassName="bg-primary-soft text-primary"
      />
      <Card.Body className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-neutral-70">Age</p>
            <p className="font-semibold text-neutral-95">{calculateAge(patient.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-70">Gender</p>
            <p className="font-semibold text-neutral-95">{patient.gender ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-70">Phone</p>
            <p className="font-semibold text-neutral-95">{patient.phone ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-70">DOB</p>
            <p className="font-semibold text-neutral-95">
              {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMM d, yyyy") : "N/A"}
            </p>
          </div>
        </div>

        {queueNotes ? (
          <div className="rounded-lg border border-subtle bg-neutral-20 p-3">
            <p className="mb-1 text-xs text-neutral-70">Queue Notes</p>
            <p className="text-sm text-neutral-90">{queueNotes}</p>
          </div>
        ) : null}

        <Badge tone={patient.status === "ACTIVE" ? "success" : "danger"}>{patient.status}</Badge>
      </Card.Body>
    </Card>
  );
}
