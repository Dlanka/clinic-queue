import type { FieldArrayWithId } from "react-hook-form";
import { Badge, EmptyState, IconButton } from "@/components/ui";
import type { Medicine } from "@/services/medicine.service";
import type { ConsultationValues } from "@/features/queue/schemas/consultation.schema";

interface ConsultationPrescriptionSelectedListProps {
  rows: Array<{
    field: FieldArrayWithId<ConsultationValues, "prescriptionItems", "id">;
    index: number;
  }>;
  medicines: Medicine[];
  readOnly: boolean;
  onRemove: (index: number) => void;
}

export function ConsultationPrescriptionSelectedList({
  rows,
  medicines,
  readOnly,
  onRemove
}: ConsultationPrescriptionSelectedListProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        iconName="clipboardList"
        title="No medicines added"
        description="Select a medicine on the left and click Add to Prescription."
        className="min-h-80 border-0"
      />
    );
  }

  return (
    <>
      {rows.map(({ field, index }) => {
        const medicine = medicines.find((item) => item.id === field.medicineId);
        const durationLabel =
          typeof field.durationDays === "number" ? `${field.durationDays} days` : undefined;

        return (
          <div
            key={field.id}
            className="flex items-center justify-between gap-3 rounded-md border border-subtle bg-neutral-40/50 px-4 py-3"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-success-soft text-2xs font-bold text-success">
                {index + 1}
              </span>

              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-semibold text-neutral-90">
                  {medicine?.name ?? "Medicine"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {field.dosage ? (
                    <Badge tone="neutral" size="sm" iconName="table-2" variant="capitalize">
                      {field.dosage}
                    </Badge>
                  ) : null}
                  {field.frequency ? (
                    <Badge tone="neutral" size="sm" iconName="clock3" variant="capitalize">
                      {field.frequency}
                    </Badge>
                  ) : null}
                  {durationLabel ? (
                    <Badge tone="neutral" size="sm" iconName="calendarDays" variant="capitalize">
                      {durationLabel}
                    </Badge>
                  ) : null}
                </div>
                {field.instructions ? (
                  <p className="text-xs text-neutral-70">{field.instructions}</p>
                ) : null}
              </div>
            </div>

            {!readOnly ? (
              <IconButton
                type="button"
                tone="neutral"
                iconName="x"
                aria-label={`Remove ${medicine?.name ?? "medicine"} from prescription`}
                onClick={() => onRemove(index)}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
}
