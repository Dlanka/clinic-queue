import { FieldGroup, Input } from "@/components/ui";
import { SettingsSwitchGroup, type SettingsSwitchGroupItem } from "./settings-switch-group";
import type { AccessSettingsState } from "../settings.types";

type SettingsAccessSectionProps = {
  value: AccessSettingsState;
  onChange: (next: AccessSettingsState) => void;
};

type AccessSwitchKey =
  | "doctorLandingConsultation"
  | "enforceRoleMatrix"
  | "allowConcurrentSessions";

export function SettingsAccessSection({ value, onChange }: SettingsAccessSectionProps) {
  const switchItems: SettingsSwitchGroupItem<AccessSwitchKey>[] = [
    {
      key: "doctorLandingConsultation",
      title: "Doctor default landing: Consultation",
      description: "Doctors open consultation workspace as primary home",
      enabled: value.doctorLandingConsultation
    },
    {
      key: "enforceRoleMatrix",
      title: "Enforce role matrix",
      description: "Hide unauthorized actions and protected routes",
      enabled: value.enforceRoleMatrix
    },
    {
      key: "allowConcurrentSessions",
      title: "Allow concurrent sessions",
      description: "Users can be logged in from multiple devices",
      enabled: value.allowConcurrentSessions
    }
  ];

  const handleToggle = (key: AccessSwitchKey, next: boolean) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <>
      <SettingsSwitchGroup items={switchItems} onToggle={handleToggle} />

      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup
          id="settings-session-timeout"
          label="Session Timeout"
          hint="Idle duration before automatic logout"
        >
          <div className="relative">
            <Input
              id="settings-session-timeout"
              type="number"
              min={5}
              max={480}
              className="pr-24"
              value={value.sessionTimeoutMinutes}
              onChange={(event) => onChange({ ...value, sessionTimeoutMinutes: event.target.value })}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              minutes
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-max-login-attempts" label="Max Login Attempts" hint="Before account is temporarily locked">
          <div className="relative">
            <Input
              id="settings-max-login-attempts"
              type="number"
              min={1}
              max={20}
              className="pr-24"
              value={value.maxLoginAttempts}
              onChange={(event) => onChange({ ...value, maxLoginAttempts: event.target.value })}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              attempts
            </span>
          </div>
        </FieldGroup>
      </div>
    </>
  );
}

