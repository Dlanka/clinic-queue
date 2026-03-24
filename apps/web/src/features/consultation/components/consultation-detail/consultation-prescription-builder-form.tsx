import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Combobox,
  FieldGroup,
  SectionDivider,
  Select,
  Textarea,
  type SelectOption
} from "@/components/ui";
import {
  PRESCRIPTION_DOSAGE_OPTIONS,
  PRESCRIPTION_DURATION_OPTIONS,
  PRESCRIPTION_FREQUENCY_OPTIONS
} from "@/features/consultation/constants/prescription-options";
import {
  normalizePrescriptionDraft,
  type PrescriptionDraftValues
} from "@/features/consultation/schemas/prescription-draft.schema";
import { prescriptionDraftResolver } from "@/features/consultation/utils/prescription-draft.utils";

interface ConsultationPrescriptionBuilderFormProps {
  medicineOptions: SelectOption[];
  readOnly: boolean;
  onAdd: (payload: {
    medicineId: string;
    dosage?: string;
    frequency?: string;
    durationDays?: number;
    instructions?: string;
  }) => void;
}

const defaultDraftValues: PrescriptionDraftValues = {
  medicineId: "",
  dosage: "",
  frequency: "",
  durationDays: "",
  instructions: ""
};

export function ConsultationPrescriptionBuilderForm({
  medicineOptions,
  readOnly,
  onAdd
}: ConsultationPrescriptionBuilderFormProps) {
  const form = useForm<PrescriptionDraftValues>({
    resolver: prescriptionDraftResolver,
    defaultValues: defaultDraftValues
  });

  const handleAdd = (values: PrescriptionDraftValues) => {
    const normalized = normalizePrescriptionDraft(values);

    onAdd({
      medicineId: normalized.medicineId,
      dosage: normalized.dosage || undefined,
      frequency: normalized.frequency || undefined,
      durationDays: normalized.durationDays,
      instructions: normalized.instructions || undefined
    });

    form.reset(defaultDraftValues);
  };

  return (
    <form
      className="space-y-3 border-b border-subtle px-6 py-4 lg:border-b-0 lg:border-r"
      onSubmit={form.handleSubmit(handleAdd)}
    >
      <SectionDivider label="Add Medicine" iconName="plus" showLeadingLine={false} />

      <FieldGroup
        id="prescription-draft-medicine"
        label="Medicine"
        required
        error={form.formState.errors.medicineId?.message}
      >
        <Controller
          control={form.control}
          name="medicineId"
          render={({ field }) => (
            <Select
              inputId="prescription-draft-medicine"
              isDisabled={readOnly}
              options={medicineOptions}
              value={medicineOptions.find((option) => option.value === field.value) ?? null}
              onChange={(next) => field.onChange(next?.value ?? "")}
            />
          )}
        />
      </FieldGroup>

      <div className="grid gap-3 md:grid-cols-2">
        <FieldGroup
          id="prescription-draft-dosage"
          label="Dosage"
          error={form.formState.errors.dosage?.message}
        >
          <Controller
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <Combobox
                inputId="prescription-draft-dosage"
                isDisabled={readOnly}
                options={PRESCRIPTION_DOSAGE_OPTIONS}
                value={
                  PRESCRIPTION_DOSAGE_OPTIONS.find((option) => option.value === field.value) ??
                  (field.value ? { value: field.value, label: field.value } : null)
                }
                onChange={(next) => field.onChange(next?.value ?? "")}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup
          id="prescription-draft-frequency"
          label="Frequency"
          error={form.formState.errors.frequency?.message}
        >
          <Controller
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <Combobox
                inputId="prescription-draft-frequency"
                isDisabled={readOnly}
                options={PRESCRIPTION_FREQUENCY_OPTIONS}
                value={
                  PRESCRIPTION_FREQUENCY_OPTIONS.find((option) => option.value === field.value) ??
                  (field.value ? { value: field.value, label: field.value } : null)
                }
                onChange={(next) => field.onChange(next?.value ?? "")}
              />
            )}
          />
        </FieldGroup>
      </div>

      <FieldGroup
        id="prescription-draft-duration"
        label="Duration Days"
        error={form.formState.errors.durationDays?.message}
      >
        <Controller
          control={form.control}
          name="durationDays"
          render={({ field }) => (
            <Combobox
              inputId="prescription-draft-duration"
              isDisabled={readOnly}
              options={PRESCRIPTION_DURATION_OPTIONS}
              value={
                PRESCRIPTION_DURATION_OPTIONS.find((option) => option.value === field.value) ??
                (field.value ? { value: field.value, label: `${field.value} days` } : null)
              }
              onChange={(next) => field.onChange(next?.value ?? "")}
            />
          )}
        />
      </FieldGroup>

      <FieldGroup
        id="prescription-draft-instructions"
        label="Instructions"
        error={form.formState.errors.instructions?.message}
      >
        <Textarea
          id="prescription-draft-instructions"
          rows={2}
          disabled={readOnly}
          {...form.register("instructions")}
        />
      </FieldGroup>

      {!readOnly ? (
        <Button
          type="submit"
          size="md"
          intent="primary"
          variant="tonal"
          startIconName="plus"
          className="w-full"
        >
          Add to Prescription
        </Button>
      ) : null}
    </form>
  );
}
