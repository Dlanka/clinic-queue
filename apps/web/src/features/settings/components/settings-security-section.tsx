import { Button, FieldGroup, Input, Select } from "@/components/ui";
import { SettingsSwitchGroup, type SettingsSwitchGroupItem } from "./settings-switch-group";
import type { SecuritySettingsState } from "../settings.types";

type SettingsSecuritySectionProps = {
  value: SecuritySettingsState;
  onChange: (next: SecuritySettingsState) => void;
};

type SecuritySwitchKey =
  | "forceStrongPasswordRule"
  | "rotateSessionOnRefresh"
  | "showAuditTrailInAdminPages";

const defaultSecurityState: SecuritySettingsState = {
  minimumPasswordLength: "8",
  tokenRotationPolicy: "Cookie refresh token rotation",
  forceStrongPasswordRule: true,
  rotateSessionOnRefresh: true,
  showAuditTrailInAdminPages: true
};

export function SettingsSecuritySection({ value, onChange }: SettingsSecuritySectionProps) {
  const switchItems: SettingsSwitchGroupItem<SecuritySwitchKey>[] = [
    {
      key: "forceStrongPasswordRule",
      title: "Force strong password rule",
      description: "Require uppercase, number, and special character",
      enabled: value.forceStrongPasswordRule
    },
    {
      key: "rotateSessionOnRefresh",
      title: "Rotate session on refresh",
      description: "Issues a new session token on each page refresh",
      enabled: value.rotateSessionOnRefresh
    },
    {
      key: "showAuditTrailInAdminPages",
      title: "Show audit trail in admin pages",
      description: "Display change history and user action logs",
      enabled: value.showAuditTrailInAdminPages
    }
  ];

  const handleToggle = (key: SecuritySwitchKey, next: boolean) => {
    onChange({ ...value, [key]: next });
  };

  const resetToDefault = () => {
    onChange(defaultSecurityState);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup id="settings-security-min-password-length" label="Minimum Password Length">
          <div className="relative">
            <Input
              id="settings-security-min-password-length"
              type="number"
              min={6}
              max={64}
              className="pr-20"
              value={value.minimumPasswordLength}
              onChange={(event) =>
                onChange({ ...value, minimumPasswordLength: event.target.value })
              }
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              chars
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-security-token-rotation" label="Token Rotation">
          <Select
            inputId="settings-security-token-rotation"
            options={[
              { value: "Cookie refresh token rotation", label: "Cookie refresh token rotation" },
              { value: "Static refresh token", label: "Static refresh token" }
            ]}
            value={{ value: value.tokenRotationPolicy, label: value.tokenRotationPolicy }}
            onChange={(next) =>
              onChange({ ...value, tokenRotationPolicy: next?.value ?? value.tokenRotationPolicy })
            }
          />
        </FieldGroup>
      </div>

      <div className="-mx-6 border-t border-subtle px-6 pt-4">
        <SettingsSwitchGroup items={switchItems} onToggle={handleToggle} />
      </div>

      <div className="-mx-6 border-t border-subtle px-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/40 bg-danger-soft/15 px-4 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-danger">
              Reset all security policies to default
            </p>
            <p className="text-xs text-neutral-90">
              This will revert all settings in this section to factory defaults
            </p>
          </div>

          <Button variant="outlined" size="sm" intent="danger" onClick={resetToDefault}>
            Reset to Default
          </Button>
        </div>
      </div>
    </>
  );
}
