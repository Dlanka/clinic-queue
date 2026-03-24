import { Controller, type UseFormReturn } from "react-hook-form";
import { Button, FieldGroup, Input } from "@/components/ui";
import type { Patient } from "@/services/patient.service";
import type { QueueFormValues } from "../schemas/queue-form.schema";
import { QueueDuplicatePhoneNotice } from "./queue-duplicate-phone-notice";

interface QueueQuickRegisterFormProps {
  form: UseFormReturn<QueueFormValues>;
  loading: boolean;
  duplicatePatients: Patient[];
  onDismissDuplicateNotice: () => void;
  onUseExistingPatient: (patientId: string, values: QueueFormValues) => void;
  onCreateNewPatientAnyway: (values: QueueFormValues) => void | Promise<void>;
}

export function QueueQuickRegisterForm({
  form,
  loading,
  duplicatePatients,
  onDismissDuplicateNotice,
  onUseExistingPatient,
  onCreateNewPatientAnyway
}: QueueQuickRegisterFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup
          id="queue-quick-first-name"
          label="First Name *"
          error={form.formState.errors.quickFirstName?.message}
        >
          <Input
            id="queue-quick-first-name"
            placeholder="First name..."
            {...form.register("quickFirstName")}
          />
        </FieldGroup>

        <FieldGroup
          id="queue-quick-last-name"
          label="Last Name *"
          error={form.formState.errors.quickLastName?.message}
        >
          <Input
            id="queue-quick-last-name"
            placeholder="Last name..."
            {...form.register("quickLastName")}
          />
        </FieldGroup>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup id="queue-quick-phone" label="Phone">
          <Input
            id="queue-quick-phone"
            placeholder="+9477 000 0000"
            {...form.register("quickPhone")}
          />
        </FieldGroup>

        <FieldGroup id="queue-quick-dob" label="Date Of Birth">
          <Input id="queue-quick-dob" type="date" {...form.register("quickDateOfBirth")} />
        </FieldGroup>
      </div>

      <FieldGroup id="queue-quick-gender" label="Gender">
        <Controller
          control={form.control}
          name="quickGender"
          render={({ field }) => {
            const selectedValue = field.value ?? "MALE";

            return (
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "MALE", label: "Male", iconName: "mars" as const },
                  { value: "FEMALE", label: "Female", iconName: "venus" as const },
                  { value: "OTHER", label: "Other", iconName: "sparkles" as const }
                ].map((option) => {
                  const selected = selectedValue === option.value;

                  return (
                    <Button
                      preventAnimation
                      key={option.value}
                      type="button"
                      size="sm"
                      startIconName={option.iconName}
                      variant={selected ? "tonal" : "outlined"}
                      intent={selected ? "info" : "secondary"}
                      onClick={() => field.onChange(option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            );
          }}
        />
      </FieldGroup>

      <QueueDuplicatePhoneNotice
        duplicatePatients={duplicatePatients}
        loading={loading}
        onDismiss={onDismissDuplicateNotice}
        onUseExistingPatient={(patientId) => onUseExistingPatient(patientId, form.getValues())}
        onCreateNewPatientAnyway={() => onCreateNewPatientAnyway(form.getValues())}
      />
    </div>
  );
}



