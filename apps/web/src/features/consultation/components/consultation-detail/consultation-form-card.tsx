import type { UseFormRegister } from "react-hook-form";
import { Badge, Card, FieldGroup, SectionDivider, Textarea } from "@/components/ui";
import { iconMap } from "@/config/icons";
import type { ConsultationValues } from "@/features/queue/schemas/consultation.schema";
import { VitalMetricCard } from "@/components/ui/vital-metric-card";

interface ConsultationFormCardProps {
  register: UseFormRegister<ConsultationValues>;
  readOnly: boolean;
}

export function ConsultationFormCard({ register, readOnly }: ConsultationFormCardProps) {
  const HeartIcon = iconMap.heart;

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Consultation Form"
        subtitle="Record symptoms, diagnosis and visit notes"
        iconName="activity"
        iconClassName="bg-primary-soft text-primary"
        className="border-b border-subtle"
      />

      <Card.Body>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px]">
          <div className="rounded-lg border border-subtle bg-primary-soft/20 px-5 py-5">
            <SectionDivider
              className="mb-3"
              label="Clinical Assessment"
              iconName="activity"
              showLeadingLine={false}
            />

            <div className="space-y-3">
              <FieldGroup id="consultation-symptoms" label="Symptoms" required>
                <Textarea
                  id="consultation-symptoms"
                  rows={4}
                  disabled={readOnly}
                  placeholder="Describe symptoms - onset, duration, severity, location..."
                  {...register("symptoms")}
                />
              </FieldGroup>

              <div className="grid gap-3 md:grid-cols-2">
                <FieldGroup id="consultation-diagnosis" label="Diagnosis" hint="ICD-10 code optional">
                  <Textarea
                    id="consultation-diagnosis"
                    rows={3}
                    disabled={readOnly}
                    placeholder="Provisional or confirmed diagnosis..."
                    {...register("diagnosis")}
                  />
                </FieldGroup>

                <FieldGroup id="consultation-notes" label="Notes" hint="Internal note">
                  <Textarea
                    id="consultation-notes"
                    rows={3}
                    disabled={readOnly}
                    placeholder="Follow-up plan, referrals..."
                    {...register("notes")}
                  />
                </FieldGroup>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="inline-flex items-center gap-1.5 text-3xs font-semibold uppercase tracking-section text-neutral-70">
              <span className="text-danger">
                <HeartIcon size={12} />
              </span>
              Vitals (optional)
            </p>

            <div className="space-y-3">
              <VitalMetricCard
                label="BP"
                iconName="heart"
                iconClassName="text-danger"
                unit="mmHg"
                badgeSlot={
                  readOnly ? (
                    <Badge tone="neutral" size="sm">
                      Read
                    </Badge>
                  ) : (
                    <Badge tone="success" size="sm" className="text-3xs">
                      Normal
                    </Badge>
                  )
                }
                inputProps={{
                  placeholder: "120/80",
                  disabled: readOnly,
                  ...register("bloodPressure")
                }}
              />

              <VitalMetricCard
                label="Pulse"
                iconName="clock3"
                iconClassName="text-warning"
                unit="bpm"
                inputProps={{
                  type: "number",
                  placeholder: "-",
                  disabled: readOnly,
                  ...register("pulse", { valueAsNumber: true })
                }}
              />

              <VitalMetricCard
                label="Temp"
                iconName="thermometer"
                iconClassName="text-tertiary"
                unit="\u00B0F"
                inputProps={{
                  type: "number",
                  step: "0.1",
                  placeholder: "-",
                  disabled: readOnly,
                  ...register("temperature", { valueAsNumber: true })
                }}
              />

              <VitalMetricCard
                label="Weight"
                iconName="weight"
                iconClassName="text-success"
                unit="kg"
                inputProps={{
                  type: "number",
                  step: "0.1",
                  placeholder: "-",
                  disabled: readOnly,
                  ...register("weight", { valueAsNumber: true })
                }}
              />
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

