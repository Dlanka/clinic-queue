import { FieldGroup, Input, Select } from "@/components/ui";
import { SettingsSwitchGroup, type SettingsSwitchGroupItem } from "./settings-switch-group";
import type { PharmacySettingsState } from "../settings.types";

type SettingsPharmacySectionProps = {
  value: PharmacySettingsState;
  onChange: (next: PharmacySettingsState) => void;
};

type PharmacySwitchKey =
  | "printEnabledByDefaultOnDispense"
  | "allowEditBeforeDispense"
  | "allowEditAfterDispense";

export function SettingsPharmacySection({ value, onChange }: SettingsPharmacySectionProps) {
  const switchItems: SettingsSwitchGroupItem<PharmacySwitchKey>[] = [
    {
      key: "printEnabledByDefaultOnDispense",
      title: "Print enabled by default on dispense",
      description: "Auto-trigger print dialog when marking as dispensed",
      enabled: value.printEnabledByDefaultOnDispense
    },
    {
      key: "allowEditBeforeDispense",
      title: "Allow edit before dispense",
      description: "Pharmacist can modify medicines before dispensing",
      enabled: value.allowEditBeforeDispense
    },
    {
      key: "allowEditAfterDispense",
      title: "Allow edit after dispense",
      description: "Allows changes to a prescription after it is dispensed",
      enabled: value.allowEditAfterDispense
    }
  ];

  const handleToggle = (key: PharmacySwitchKey, next: boolean) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup
          id="settings-pharmacy-low-stock-threshold"
          label="Default Low Stock Threshold"
          hint="Alert when stock falls below this level"
        >
          <div className="relative">
            <Input
              id="settings-pharmacy-low-stock-threshold"
              type="number"
              min={0}
              max={100000}
              className="pr-20"
              value={value.defaultLowStockThreshold}
              onChange={(event) =>
                onChange({ ...value, defaultLowStockThreshold: event.target.value })
              }
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              units
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-pharmacy-thermal-template" label="Thermal Template" hint="Used for printed prescription slips">
          <Select
            inputId="settings-pharmacy-thermal-template"
            options={[
              { value: "80mm - Standard thermal", label: "80mm - Standard thermal" },
              { value: "58mm - Compact thermal", label: "58mm - Compact thermal" }
            ]}
            value={{ value: value.thermalPrintTemplate, label: value.thermalPrintTemplate }}
            onChange={(next) =>
              onChange({ ...value, thermalPrintTemplate: next?.value ?? value.thermalPrintTemplate })
            }
          />
        </FieldGroup>
      </div>

      <SettingsSwitchGroup items={switchItems} onToggle={handleToggle} />
    </>
  );
}

