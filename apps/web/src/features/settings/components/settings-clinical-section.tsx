import { FieldGroup, Input, Select } from "@/components/ui";
import { SettingsSwitchGroup, type SettingsSwitchGroupItem } from "./settings-switch-group";
import type { ClinicalSettingsState } from "../settings.types";

type SettingsClinicalSectionProps = {
  value: ClinicalSettingsState;
  onChange: (next: ClinicalSettingsState) => void;
};

type ClinicalSwitchKey =
  | "symptomsRequired"
  | "diagnosisRequiredToComplete"
  | "lockConsultationAfterCompletion"
  | "enableVitalWarnings";

export function SettingsClinicalSection({ value, onChange }: SettingsClinicalSectionProps) {
  const switchItems: SettingsSwitchGroupItem<ClinicalSwitchKey>[] = [
    {
      key: "symptomsRequired",
      title: "Symptoms required",
      description: "Doctor must fill symptoms before completing consultation",
      enabled: value.symptomsRequired
    },
    {
      key: "diagnosisRequiredToComplete",
      title: "Diagnosis required to complete",
      description: "Blocks completion if diagnosis field is empty",
      enabled: value.diagnosisRequiredToComplete
    },
    {
      key: "lockConsultationAfterCompletion",
      title: "Lock consultation after completion",
      description: "Prevents editing once status is set to Completed",
      enabled: value.lockConsultationAfterCompletion
    },
    {
      key: "enableVitalWarnings",
      title: "Enable vital warnings",
      description: "Show color-coded alerts for abnormal vital readings",
      enabled: value.enableVitalWarnings
    }
  ];

  const handleToggle = (key: ClinicalSwitchKey, next: boolean) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <>
      <div className="rounded-lg border border-info/50 bg-info-soft/25 px-4 py-3 text-primary">
        <p className="text-base font-semibold">
          These settings affect all doctors in this tenant. Changes take effect on the next consultation.
        </p>
      </div>

      <SettingsSwitchGroup items={switchItems} onToggle={handleToggle} />

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup
          id="settings-clinical-edit-window"
          label="Edit Window After Completion"
          hint="Time allowed to edit a completed consultation"
        >
          <div className="relative">
            <Input
              id="settings-clinical-edit-window"
              type="number"
              min={0}
              max={168}
              className="pr-20"
              value={value.editWindowAfterCompletionHours}
              onChange={(event) =>
                onChange({ ...value, editWindowAfterCompletionHours: event.target.value })
              }
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              hours
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-clinical-vitals-threshold" label="Vitals Warning Threshold">
          <Select
            inputId="settings-clinical-vitals-threshold"
            options={[
              { value: "Standard clinical ranges", label: "Standard clinical ranges" },
              { value: "Strict clinical ranges", label: "Strict clinical ranges" }
            ]}
            value={{ value: value.vitalsWarningThreshold, label: value.vitalsWarningThreshold }}
            onChange={(next) =>
              onChange({
                ...value,
                vitalsWarningThreshold: next?.value ?? value.vitalsWarningThreshold
              })
            }
          />
        </FieldGroup>
      </div>
    </>
  );
}

