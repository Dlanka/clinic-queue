import { Controller } from "react-hook-form";
import { Button, CenterModal, FieldGroup, Input, Select } from "@/components/ui";
import type { Patient } from "@/services/patient.service";
import { usePatientForm } from "../hooks";
import type { PatientFormValues } from "../schemas/patient-form.schema";

type PatientFormModalProps = {
  open: boolean;
  patient: Patient | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => void;
};

export function PatientFormModal({
  open,
  patient,
  loading,
  onClose,
  onSubmit
}: PatientFormModalProps) {
  const form = usePatientForm(open, patient);

  return (
    <CenterModal
      open={open}
      title={patient ? "Edit Patient" : "Create Patient"}
      description={patient ? "Update patient profile details." : "Add a new patient to this tenant."}
      iconName="users"
      variant="info"
      onClose={onClose}
      className="max-w-120"
      footer={
        <>
          <Button variant="outlined" intent="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="patient-form" disabled={loading}>
            {patient ? "Save Changes" : "Create Patient"}
          </Button>
        </>
      }
    >
      <form
        id="patient-form"
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup
            id="patient-first-name"
            label="First Name"
            error={form.formState.errors.firstName?.message}
          >
            <Input
              id="patient-first-name"
              invalid={Boolean(form.formState.errors.firstName)}
              {...form.register("firstName")}
            />
          </FieldGroup>

          <FieldGroup
            id="patient-last-name"
            label="Last Name"
            error={form.formState.errors.lastName?.message}
          >
            <Input
              id="patient-last-name"
              invalid={Boolean(form.formState.errors.lastName)}
              {...form.register("lastName")}
            />
          </FieldGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldGroup id="patient-dob" label="Date Of Birth">
            <Input id="patient-dob" type="date" {...form.register("dateOfBirth")} />
          </FieldGroup>

          <FieldGroup id="patient-gender" label="Gender">
            <Controller
              control={form.control}
              name="gender"
              render={({ field }) => (
                <Select
                  inputId="patient-gender"
                  options={[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                    { value: "OTHER", label: "Other" }
                  ]}
                  value={
                    field.value
                      ? {
                          value: field.value,
                          label: field.value.charAt(0) + field.value.slice(1).toLowerCase()
                        }
                      : null
                  }
                  onChange={(nextValue) => field.onChange(nextValue?.value)}
                />
              )}
            />
          </FieldGroup>
        </div>

        <FieldGroup id="patient-phone" label="Phone">
          <Input id="patient-phone" {...form.register("phone")} />
        </FieldGroup>

        <FieldGroup id="patient-email" label="Email" error={form.formState.errors.email?.message}>
          <Input id="patient-email" type="email" {...form.register("email")} />
        </FieldGroup>

        <FieldGroup id="patient-address" label="Address">
          <Input id="patient-address" {...form.register("address")} />
        </FieldGroup>

        <FieldGroup id="patient-status" label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                inputId="patient-status"
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" }
                ]}
                value={
                  field.value === "ACTIVE"
                    ? { value: "ACTIVE", label: "Active" }
                    : { value: "INACTIVE", label: "Inactive" }
                }
                onChange={(nextValue) => {
                  if (!nextValue) {
                    return;
                  }
                  field.onChange(nextValue.value);
                }}
              />
            )}
          />
        </FieldGroup>
      </form>
    </CenterModal>
  );
}

