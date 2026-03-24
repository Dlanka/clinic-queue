import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFieldArrayReturn,
  type UseFormRegister
} from "react-hook-form";
import { Button, Card, FieldGroup, Input, Select, Textarea, Badge } from "@/components/ui";
import type { Medicine } from "@/services/medicine.service";
import type { ConsultationValues } from "../../schemas/consultation.schema";

interface PrescriptionBuilderCardProps {
  control: Control<ConsultationValues>;
  register: UseFormRegister<ConsultationValues>;
  errors: FieldErrors<ConsultationValues>;
  fieldArray: UseFieldArrayReturn<ConsultationValues, "prescriptionItems", "id">;
  medicineOptions: Array<{ value: string; label: string }>;
  medicines: Medicine[];
  readOnly: boolean;
}

export function PrescriptionBuilderCard({
  control,
  register,
  errors,
  fieldArray,
  medicineOptions,
  medicines,
  readOnly
}: PrescriptionBuilderCardProps) {
  const prescriptionItems = useWatch({
    control,
    name: "prescriptionItems"
  });

  return (
    <Card>
      <Card.Header
        title="Prescription Builder"
        subtitle="Optional. Add medicines for this consultation"
        iconName="plus"
        iconClassName="bg-success-soft text-success"
      />
      <Card.Body className="space-y-3">
        {fieldArray.fields.map((field, index) => {
          const selectedMedicineId = prescriptionItems?.[index]?.medicineId;
          const selectedMedicine = medicines.find((medicine) => medicine.id === selectedMedicineId);

          return (
            <div key={field.id} className="space-y-3 rounded-lg border border-subtle p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-95">Medicine {index + 1}</p>
                {fieldArray.fields.length > 1 && !readOnly ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="text"
                    intent="error"
                    onClick={() => fieldArray.remove(index)}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>

              <FieldGroup
                id={`rx-medicine-${index}`}
                label="Medicine"
                error={errors.prescriptionItems?.[index]?.medicineId?.message}
              >
                <Controller
                  control={control}
                  name={`prescriptionItems.${index}.medicineId`}
                  render={({ field: itemField }) => (
                    <Select
                      inputId={`rx-medicine-${index}`}
                      isDisabled={readOnly}
                      options={medicineOptions}
                      value={medicineOptions.find((option) => option.value === itemField.value) ?? null}
                      onChange={(nextValue) => itemField.onChange(nextValue?.value ?? "")}
                    />
                  )}
                />
              </FieldGroup>

              {selectedMedicine ? (
                <Badge tone={selectedMedicine.isLowStock ? "warning" : "success"}>
                  Stock: {selectedMedicine.stockQty} {selectedMedicine.unit ?? "units"}
                </Badge>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2">
                <FieldGroup id={`rx-dosage-${index}`} label="Dosage">
                  <Input
                    id={`rx-dosage-${index}`}
                    disabled={readOnly}
                    {...register(`prescriptionItems.${index}.dosage`)}
                  />
                </FieldGroup>
                <FieldGroup id={`rx-frequency-${index}`} label="Frequency">
                  <Input
                    id={`rx-frequency-${index}`}
                    disabled={readOnly}
                    {...register(`prescriptionItems.${index}.frequency`)}
                  />
                </FieldGroup>
                <FieldGroup id={`rx-duration-${index}`} label="Duration Days">
                  <Input
                    id={`rx-duration-${index}`}
                    type="number"
                    disabled={readOnly}
                    {...register(`prescriptionItems.${index}.durationDays`, { valueAsNumber: true })}
                  />
                </FieldGroup>
                <FieldGroup id={`rx-instructions-${index}`} label="Instructions">
                  <Textarea
                    id={`rx-instructions-${index}`}
                    rows={2}
                    disabled={readOnly}
                    {...register(`prescriptionItems.${index}.instructions`)}
                  />
                </FieldGroup>
              </div>
            </div>
          );
        })}

        {!readOnly ? (
          <Button
            type="button"
            variant="outlined"
            intent="neutral"
            startIconName="plus"
            onClick={() =>
              fieldArray.append({
                medicineId: "",
                dosage: "",
                frequency: "",
                durationDays: undefined,
                instructions: ""
              })
            }
          >
            Add Medicine
          </Button>
        ) : null}
      </Card.Body>
    </Card>
  );
}
