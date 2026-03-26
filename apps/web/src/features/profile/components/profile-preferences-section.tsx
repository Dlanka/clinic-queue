import type { UseFormReturn } from "react-hook-form";
import { FieldGroup, Select } from "@/components/ui";
import { SettingsSwitchGroup } from "@/features/settings/components/settings-switch-group";

type PreferencesFormShape = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
};

const languageOptions = [
  { value: "en", label: "English" },
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" }
];

const timezoneOptions = [
  { value: "Asia/Colombo", label: "Asia/Colombo" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
  { value: "UTC", label: "UTC" }
];

const dateFormatOptions = [
  { value: "MMM dd, yyyy", label: "MMM dd, yyyy" },
  { value: "dd/MM/yyyy", label: "dd/MM/yyyy" },
  { value: "yyyy-MM-dd", label: "yyyy-MM-dd" }
];

const timeFormatOptions = [
  { value: "12-hour (AM/PM)", label: "12-hour (AM/PM)" },
  { value: "24-hour", label: "24-hour" }
];

type ProfilePreferencesSectionProps = {
  form: UseFormReturn<PreferencesFormShape>;
};

export function ProfilePreferencesSection({ form }: ProfilePreferencesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup id="profile-language" label="Language">
          <Select
            inputId="profile-language"
            options={languageOptions}
            value={languageOptions.find((item) => item.value === form.watch("language"))}
            onChange={(next) => form.setValue("language", next?.value ?? "en")}
          />
        </FieldGroup>

        <FieldGroup id="profile-timezone" label="Timezone">
          <Select
            inputId="profile-timezone"
            options={timezoneOptions}
            value={timezoneOptions.find((item) => item.value === form.watch("timezone"))}
            onChange={(next) => form.setValue("timezone", next?.value ?? "Asia/Colombo")}
          />
        </FieldGroup>

        <FieldGroup id="profile-date-format" label="Date Format">
          <Select
            inputId="profile-date-format"
            options={dateFormatOptions}
            value={dateFormatOptions.find((item) => item.value === form.watch("dateFormat"))}
            onChange={(next) => form.setValue("dateFormat", next?.value ?? "MMM dd, yyyy")}
          />
        </FieldGroup>

        <FieldGroup id="profile-time-format" label="Time Format">
          <Select
            inputId="profile-time-format"
            options={timeFormatOptions}
            value={timeFormatOptions.find((item) => item.value === form.watch("timeFormat"))}
            onChange={(next) => form.setValue("timeFormat", next?.value ?? "12-hour (AM/PM)")}
          />
        </FieldGroup>
      </div>

      <SettingsSwitchGroup
        items={[
          {
            key: "emailNotifications",
            title: "Email Notifications",
            description: "Receive account and security notifications by email",
            enabled: form.watch("emailNotifications")
          },
          {
            key: "inAppNotifications",
            title: "In-app Notifications",
            description: "Show alerts and reminders inside the app",
            enabled: form.watch("inAppNotifications")
          }
        ]}
        onToggle={(key, next) =>
          form.setValue(key as "emailNotifications" | "inAppNotifications", next)
        }
      />
    </div>
  );
}
