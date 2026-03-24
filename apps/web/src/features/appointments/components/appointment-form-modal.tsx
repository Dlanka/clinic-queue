import { Controller } from "react-hook-form";
import { Button, FieldGroup, Input, RightPanelModal, Select, Textarea } from "@/components/ui";
import type { Appointment } from "@/services/appointment.service";
import type { AppointmentFormValues } from "../schemas/appointment-form.schema";
import { useAppointmentForm } from "../hooks";

interface AppointmentFormModalProps {
  open: boolean;
  appointment: Appointment | null;
  doctorOptions: Array<{ value: string; label: string }>;
  patientOptions: Array<{ value: string; label: string }>;
  doctorsLoading: boolean;
  patientsLoading: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: AppointmentFormValues) => void;
}

export function AppointmentFormModal({
  open,
  appointment,
  doctorOptions,
  patientOptions,
  doctorsLoading,
  patientsLoading,
  loading,
  onClose,
  onSubmit
}: AppointmentFormModalProps) {
  const form = useAppointmentForm(open, appointment);

  return (
    <RightPanelModal
      open={open}
      title={appointment ? "Edit Appointment" : "Create Appointment"}
      description={
        appointment ? "Update appointment status or schedule." : "Set patient, doctor and appointment date."
      }
      onClose={onClose}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="appointment-form" disabled={loading}>
            {appointment ? "Save Changes" : "Create Appointment"}
          </Button>
        </>
      }
    >
      <form id="appointment-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup id="appointment-patient" label="Patient" error={form.formState.errors.patientId?.message}>
          <Controller
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <Select
                inputId="appointment-patient"
                placeholder={patientsLoading ? "Loading patients..." : "Select patient"}
                options={patientOptions}
                value={patientOptions.find((option) => option.value === field.value) ?? null}
                onChange={(nextValue) => field.onChange(nextValue?.value ?? "")}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="appointment-doctor" label="Doctor" error={form.formState.errors.doctorId?.message}>
          <Controller
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <Select
                inputId="appointment-doctor"
                placeholder={doctorsLoading ? "Loading doctors..." : "Select doctor"}
                options={doctorOptions}
                value={doctorOptions.find((option) => option.value === field.value) ?? null}
                onChange={(nextValue) => field.onChange(nextValue?.value ?? "")}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup
          id="appointment-time"
          label="Date & Time"
          error={form.formState.errors.scheduledAtLocal?.message}
        >
          <Input
            id="appointment-time"
            type="datetime-local"
            invalid={Boolean(form.formState.errors.scheduledAtLocal)}
            {...form.register("scheduledAtLocal")}
          />
        </FieldGroup>

        <FieldGroup id="appointment-status" label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                inputId="appointment-status"
                options={[
                  { value: "SCHEDULED", label: "Scheduled" },
                  { value: "COMPLETED", label: "Completed" },
                  { value: "CANCELLED", label: "Cancelled" }
                ]}
                value={
                  [
                    { value: "SCHEDULED", label: "Scheduled" },
                    { value: "COMPLETED", label: "Completed" },
                    { value: "CANCELLED", label: "Cancelled" }
                  ].find((option) => option.value === field.value) ?? null
                }
                onChange={(nextValue) => {
                  field.onChange(nextValue?.value ?? "SCHEDULED");
                }}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="appointment-notes" label="Notes" error={form.formState.errors.notes?.message}>
          <Textarea id="appointment-notes" rows={4} {...form.register("notes")} />
        </FieldGroup>
      </form>
    </RightPanelModal>
  );
}
