import { Button, FieldGroup, Input, Select, Textarea } from "@/components/ui";
import { SettingsCheckboxRow } from "./settings-checkbox-row";
import type { SystemSettingsState } from "../settings.types";

type SettingsSystemSectionProps = {
  value: SystemSettingsState;
  onChange: (next: SystemSettingsState) => void;
  onOpenProfile: () => void;
  onOpenUsers: () => void;
};

export function SettingsSystemSection({
  value,
  onChange,
  onOpenProfile,
  onOpenUsers
}: SettingsSystemSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup id="settings-system-dashboard-refresh" label="Dashboard Refresh">
          <div className="relative">
            <Input
              id="settings-system-dashboard-refresh"
              type="number"
              min={5}
              max={300}
              className="pr-28"
              value={value.dashboardRefreshSeconds}
              onChange={(event) =>
                onChange({ ...value, dashboardRefreshSeconds: event.target.value })
              }
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              seconds
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-system-default-theme" label="Default Theme">
          <Select
            inputId="settings-system-default-theme"
            options={[
              { value: "Dark", label: "Dark" },
              { value: "Light", label: "Light" },
              { value: "System", label: "System" }
            ]}
            value={{ value: value.defaultTheme, label: value.defaultTheme }}
            onChange={(next) =>
              onChange({ ...value, defaultTheme: next?.value ?? value.defaultTheme })
            }
          />
        </FieldGroup>
      </div>

      <div className="space-y-3">
        <SettingsCheckboxRow
          label="Enable soft delete behavior"
          checked={value.enableSoftDeleteBehavior}
          onChange={(checked) => onChange({ ...value, enableSoftDeleteBehavior: checked })}
        />
        <SettingsCheckboxRow
          label="Allow appointment double-booking"
          checked={value.allowAppointmentDoubleBooking}
          onChange={(checked) => onChange({ ...value, allowAppointmentDoubleBooking: checked })}
        />
      </div>

      <FieldGroup id="settings-system-notes" label="System Notes">
        <Textarea
          id="settings-system-notes"
          rows={4}
          value={value.systemNotes}
          onChange={(event) => onChange({ ...value, systemNotes: event.target.value })}
        />
      </FieldGroup>

      <div className="flex flex-wrap gap-2">
        <Button variant="tonal" intent="info" startIconName="user" onClick={onOpenProfile}>
          Open My Profile
        </Button>
        <Button variant="tonal" intent="neutral" startIconName="users" onClick={onOpenUsers}>
          Open Users
        </Button>
      </div>
    </>
  );
}
