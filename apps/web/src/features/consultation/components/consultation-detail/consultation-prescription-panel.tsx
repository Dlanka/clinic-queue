import { useMemo } from "react";
import type { UseFieldArrayReturn } from "react-hook-form";
import { Badge, Card, type SelectOption } from "@/components/ui";
import type { Medicine } from "@/services/medicine.service";
import type { ConsultationValues } from "@/features/queue/schemas/consultation.schema";
import { ConsultationPrescriptionBuilderForm } from "./consultation-prescription-builder-form";
import { ConsultationPrescriptionSelectedList } from "./consultation-prescription-selected-list";

interface ConsultationPrescriptionPanelProps {
  fieldArray: UseFieldArrayReturn<ConsultationValues, "prescriptionItems", "id">;
  medicineOptions: SelectOption[];
  medicines: Medicine[];
  readOnly: boolean;
}

export function ConsultationPrescriptionPanel({
  fieldArray,
  medicineOptions,
  medicines,
  readOnly
}: ConsultationPrescriptionPanelProps) {
  const selectedRows = useMemo(
    () =>
      fieldArray.fields
        .map((field, index) => ({ field, index }))
        .filter(({ field }) => Boolean(field.medicineId?.trim())),
    [fieldArray.fields]
  );

  const medicineCount = selectedRows.length;

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Prescription Builder"
        subtitle="Add medicines for this consultation"
        iconName="clipboardList"
        iconClassName="bg-success-soft text-success"
        action={
          <Badge tone="success" size="sm">
            {medicineCount} medicine{medicineCount === 1 ? "" : "s"}
          </Badge>
        }
        className="border-b border-subtle"
      />

      <Card.Body className="grid gap-0 p-0 lg:grid-cols-[1fr_1fr]">
        <ConsultationPrescriptionBuilderForm
          medicineOptions={medicineOptions}
          readOnly={readOnly}
          onAdd={(payload) => fieldArray.append(payload)}
        />

        <div className="space-y-2 px-6 py-4">
          <ConsultationPrescriptionSelectedList
            rows={selectedRows}
            medicines={medicines}
            readOnly={readOnly}
            onRemove={(index) => fieldArray.remove(index)}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
