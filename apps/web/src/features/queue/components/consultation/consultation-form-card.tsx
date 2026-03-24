import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { FieldGroup, Input, Select, Textarea, Card } from "@/components/ui";
import type { ConsultationValues } from "../../schemas/consultation.schema";

interface ConsultationFormCardProps {
  control: Control<ConsultationValues>;
  register: UseFormRegister<ConsultationValues>;
  errors: FieldErrors<ConsultationValues>;
  doctorOptions: Array<{ value: string; label: string }>;
  readOnly: boolean;
}

export function ConsultationFormCard({
  control,
  register,
  errors,
  doctorOptions,
  readOnly
}: ConsultationFormCardProps) {
  return (
    <Card>
      <Card.Header
        title="Consultation Form"
        subtitle="Record symptoms, diagnosis and visit notes"
        iconName="activity"
        iconClassName="bg-primary-soft text-primary"
      />
      <Card.Body className="space-y-4">
        <FieldGroup id="consultation-doctor" label="Doctor">
          <Controller
            control={control}
            name="doctorId"
            render={({ field }) => (
              <Select
                inputId="consultation-doctor"
                isDisabled={readOnly}
                options={doctorOptions}
                value={doctorOptions.find((option) => option.value === field.value) ?? null}
                onChange={(next) => field.onChange(next?.value ?? "")}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="consultation-symptoms" label="Symptoms" error={errors.symptoms?.message}>
          <Textarea id="consultation-symptoms" rows={4} disabled={readOnly} {...register("symptoms")} />
        </FieldGroup>

        <FieldGroup id="consultation-diagnosis" label="Diagnosis" error={errors.diagnosis?.message}>
          <Textarea id="consultation-diagnosis" rows={3} disabled={readOnly} {...register("diagnosis")} />
        </FieldGroup>

        <FieldGroup id="consultation-notes" label="Notes" error={errors.notes?.message}>
          <Textarea id="consultation-notes" rows={3} disabled={readOnly} {...register("notes")} />
        </FieldGroup>

        <div className="grid gap-3 md:grid-cols-2">
          <FieldGroup id="consultation-bp" label="Blood Pressure" error={errors.bloodPressure?.message}>
            <Input id="consultation-bp" disabled={readOnly} placeholder="120/80" {...register("bloodPressure")} />
          </FieldGroup>
          <FieldGroup id="consultation-pulse" label="Pulse" error={errors.pulse?.message}>
            <Input
              id="consultation-pulse"
              type="number"
              disabled={readOnly}
              {...register("pulse", { valueAsNumber: true })}
            />
          </FieldGroup>
          <FieldGroup id="consultation-temp" label="Temperature" error={errors.temperature?.message}>
            <Input
              id="consultation-temp"
              type="number"
              step="0.1"
              disabled={readOnly}
              {...register("temperature", { valueAsNumber: true })}
            />
          </FieldGroup>
          <FieldGroup id="consultation-weight" label="Weight" error={errors.weight?.message}>
            <Input
              id="consultation-weight"
              type="number"
              step="0.1"
              disabled={readOnly}
              {...register("weight", { valueAsNumber: true })}
            />
          </FieldGroup>
        </div>
      </Card.Body>
    </Card>
  );
}
