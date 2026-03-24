import { Button } from "@/components/ui";
import type { Patient } from "@/services/patient.service";

interface QueueDuplicatePhoneNoticeProps {
  duplicatePatients: Patient[];
  loading: boolean;
  onUseExistingPatient: (patientId: string) => void;
  onCreateNewPatientAnyway: () => void;
  onDismiss: () => void;
}

export function QueueDuplicatePhoneNotice({
  duplicatePatients,
  loading,
  onUseExistingPatient,
  onCreateNewPatientAnyway,
  onDismiss
}: QueueDuplicatePhoneNoticeProps) {
  if (duplicatePatients.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 border border-warning/40 bg-warning-soft/30 p-4">
      <p className="text-sm font-bold text-warning">
        This phone number is already used by existing patient records.
      </p>

      <div className="space-y-2">
        {duplicatePatients.map((patient) => (
          <div
            key={patient.id}
            className="flex flex-wrap items-center justify-between gap-2 border border-warning/20 bg-neutral-30 px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-95">{patient.fullName}</p>
              <p className="text-xs text-neutral-70">
                {patient.dateOfBirth ? `DOB ${patient.dateOfBirth.slice(0, 10)}` : "No DOB"}
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              variant="tonal"
              intent="info"
              disabled={loading}
              onClick={() => onUseExistingPatient(patient.id)}
            >
              Use Existing
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="tonal"
          intent="warning"
          disabled={loading}
          onClick={onCreateNewPatientAnyway}
        >
          Create New Anyway
        </Button>

        <Button
          type="button"
          size="sm"
          variant="text"
          intent="ghost"
          disabled={loading}
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

