import { FieldGroup, Input, Select } from "@/components/ui";
import type { GeneralSettingsState } from "../settings.types";

type SettingsGeneralSectionProps = {
  value: GeneralSettingsState;
  onChange: (next: GeneralSettingsState) => void;
};

export function SettingsGeneralSection({ value, onChange }: SettingsGeneralSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup id="settings-clinic-name" label="Clinic Name" required>
          <Input
            id="settings-clinic-name"
            value={value.clinicName}
            onChange={(event) => onChange({ ...value, clinicName: event.target.value })}
          />
        </FieldGroup>

        <FieldGroup id="settings-contact-number" label="Contact Number">
          <Input
            id="settings-contact-number"
            value={value.contactNumber}
            onChange={(event) => onChange({ ...value, contactNumber: event.target.value })}
          />
        </FieldGroup>

        <FieldGroup
          id="settings-timezone"
          label="Timezone"
          hint="UTC+05:30 - Sri Lanka Standard Time"
        >
          <Select
            inputId="settings-timezone"
            options={[
              { value: "Asia/Colombo", label: "Asia/Colombo" },
              { value: "Asia/Kolkata", label: "Asia/Kolkata" },
              { value: "UTC", label: "UTC" }
            ]}
            value={{ value: value.timezone, label: value.timezone }}
            onChange={(next) => onChange({ ...value, timezone: next?.value ?? value.timezone })}
          />
        </FieldGroup>

        <FieldGroup id="settings-currency" label="Currency">
          <Select
            inputId="settings-currency"
            options={[
              { value: "LKR - Sri Lankan Rupee", label: "LKR - Sri Lankan Rupee" },
              { value: "USD - US Dollar", label: "USD - US Dollar" },
              { value: "INR - Indian Rupee", label: "INR - Indian Rupee" }
            ]}
            value={{ value: value.currency, label: value.currency }}
            onChange={(next) => onChange({ ...value, currency: next?.value ?? value.currency })}
          />
        </FieldGroup>

        <FieldGroup id="settings-date-format" label="Date Format">
          <Select
            inputId="settings-date-format"
            options={[
              { value: "MMM dd, yyyy", label: "MMM dd, yyyy" },
              { value: "dd/MM/yyyy", label: "dd/MM/yyyy" },
              { value: "yyyy-MM-dd", label: "yyyy-MM-dd" }
            ]}
            value={{ value: value.dateFormat, label: value.dateFormat }}
            onChange={(next) => onChange({ ...value, dateFormat: next?.value ?? value.dateFormat })}
          />
        </FieldGroup>

        <FieldGroup id="settings-time-format" label="Time Format">
          <Select
            inputId="settings-time-format"
            options={[
              { value: "12-hour (AM/PM)", label: "12-hour (AM/PM)" },
              { value: "24-hour", label: "24-hour" }
            ]}
            value={{ value: value.timeFormat, label: value.timeFormat }}
            onChange={(next) => onChange({ ...value, timeFormat: next?.value ?? value.timeFormat })}
          />
        </FieldGroup>
      </div>

      <div className="rounded-md border border-info/60 bg-info-soft/30 px-4 py-3 text-sm text-neutral-90">
        <p>
          Timezone and currency changes apply to all users in this tenant.{" "}
          <span className="font-semibold text-primary">Existing records are not retroactively updated.</span>
        </p>
      </div>
    </>
  );
}

