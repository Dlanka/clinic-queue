import { useEffect } from "react";
import { Controller, useFieldArray, useForm, type Resolver } from "react-hook-form";
import { Button, FieldGroup, Input, RightPanelModal, Select, Textarea } from "@/components/ui";
import type { Visit } from "@/services/visit.service";
import {
  prescriptionBuilderSchema,
  type PrescriptionBuilderValues
} from "../schemas/prescription-builder.schema";

type PrescriptionBuilderModalProps = {
  open: boolean;
  visit: Visit | null;
  medicineOptions: Array<{ value: string; label: string }>;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: PrescriptionBuilderValues) => void;
};

const prescriptionBuilderResolver: Resolver<PrescriptionBuilderValues> = async (values) => {
  const parsed = prescriptionBuilderSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (accumulator, issue) => {
      const fieldName = String(issue.path.join(".") || "root");
      accumulator[fieldName] = { type: "manual", message: issue.message };
      return accumulator;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

export function PrescriptionBuilderModal({
  open,
  visit,
  medicineOptions,
  loading,
  onClose,
  onSubmit
}: PrescriptionBuilderModalProps) {
  const form = useForm<PrescriptionBuilderValues>({
    resolver: prescriptionBuilderResolver,
    defaultValues: {
      items: [
        {
          medicineId: "",
          quantity: 1,
          dosage: "",
          frequency: "",
          duration: "",
          instructions: ""
        }
      ]
    }
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "items"
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      items: [
        {
          medicineId: "",
          quantity: 1,
          dosage: "",
          frequency: "",
          duration: "",
          instructions: ""
        }
      ]
    });
  }, [form, open, visit?.id]);

  return (
    <RightPanelModal
      open={open}
      title="Prescription Builder"
      description={
        visit
          ? `Create prescription for visit on ${new Date(visit.visitedAt).toLocaleString()}`
          : "Select a visit from history to create a prescription."
      }
      onClose={onClose}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="prescription-builder-form" disabled={loading}>
            Save Prescription
          </Button>
        </>
      }
    >
      <form
        id="prescription-builder-form"
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        {fieldArray.fields.map((field, index) => (
          <div key={field.id} className="space-y-3 rounded-xl border border-neutral-variant-90/40 p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-95">Item {index + 1}</h4>
              {fieldArray.fields.length > 1 ? (
                <Button
                  intent="ghost"
                  size="sm"
                  className="!px-2 text-danger hover:bg-danger-soft"
                  onClick={() => fieldArray.remove(index)}
                  type="button"
                >
                  Remove
                </Button>
              ) : null}
            </div>

            <FieldGroup
              id={`medicine-${index}`}
              label="Medicine"
              error={form.formState.errors.items?.[index]?.medicineId?.message}
            >
              <Controller
                control={form.control}
                name={`items.${index}.medicineId`}
                render={({ field: itemField }) => (
                  <Select
                    inputId={`medicine-${index}`}
                    options={medicineOptions}
                    placeholder="Select medicine"
                    value={medicineOptions.find((option) => option.value === itemField.value) ?? null}
                    onChange={(nextValue) => itemField.onChange(nextValue?.value ?? "")}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup
              id={`quantity-${index}`}
              label="Quantity"
              error={form.formState.errors.items?.[index]?.quantity?.message}
            >
              <Input id={`quantity-${index}`} type="number" min={1} {...form.register(`items.${index}.quantity`)} />
            </FieldGroup>

            <div className="grid gap-3 md:grid-cols-2">
              <FieldGroup id={`dosage-${index}`} label="Dosage">
                <Input id={`dosage-${index}`} {...form.register(`items.${index}.dosage`)} />
              </FieldGroup>
              <FieldGroup id={`frequency-${index}`} label="Frequency">
                <Input id={`frequency-${index}`} {...form.register(`items.${index}.frequency`)} />
              </FieldGroup>
            </div>

            <FieldGroup id={`duration-${index}`} label="Duration">
              <Input id={`duration-${index}`} {...form.register(`items.${index}.duration`)} />
            </FieldGroup>

            <FieldGroup id={`instructions-${index}`} label="Instructions">
              <Textarea id={`instructions-${index}`} rows={2} {...form.register(`items.${index}.instructions`)} />
            </FieldGroup>
          </div>
        ))}

        <Button
          intent="secondary"
          type="button"
          startIconName="plus"
          onClick={() =>
            fieldArray.append({
              medicineId: "",
              quantity: 1,
              dosage: "",
              frequency: "",
              duration: "",
              instructions: ""
            })
          }
        >
          Add Item
        </Button>
      </form>
    </RightPanelModal>
  );
}
