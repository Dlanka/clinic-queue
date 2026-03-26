import { FieldGroup, Input } from "@/components/ui";
import { SettingsCheckboxRow } from "./settings-checkbox-row";
import type { QueueSettingsState } from "../settings.types";

type SettingsQueueSectionProps = {
  value: QueueSettingsState;
  onChange: (next: QueueSettingsState) => void;
};

export function SettingsQueueSection({ value, onChange }: SettingsQueueSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FieldGroup id="settings-queue-prefix" label="Queue Prefix" hint="Prepended to all ticket numbers">
          <Input
            id="settings-queue-prefix"
            value={value.queuePrefix}
            onChange={(event) => onChange({ ...value, queuePrefix: event.target.value })}
          />
        </FieldGroup>

        <FieldGroup id="settings-queue-digits" label="Queue Number Digits" hint="Zero-padded, e.g. 3 - Q-001">
          <div className="relative">
            <Input
              id="settings-queue-digits"
              type="number"
              min={1}
              max={6}
              className="pr-20"
              value={value.queueNumberDigits}
              onChange={(event) => onChange({ ...value, queueNumberDigits: event.target.value })}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              digits
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-queue-refresh" label="Auto Refresh Interval">
          <div className="relative">
            <Input
              id="settings-queue-refresh"
              type="number"
              min={5}
              max={300}
              className="pr-24"
              value={value.autoRefreshSeconds}
              onChange={(event) => onChange({ ...value, autoRefreshSeconds: event.target.value })}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              seconds
            </span>
          </div>
        </FieldGroup>

        <FieldGroup id="settings-queue-max-size" label="Max Queue Size">
          <div className="relative">
            <Input
              id="settings-queue-max-size"
              type="number"
              min={1}
              max={1000}
              className="pr-24"
              value={value.maxQueueSize}
              onChange={(event) => onChange({ ...value, maxQueueSize: event.target.value })}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-neutral-40 px-3 py-1 text-xs font-semibold text-neutral-70">
              patients
            </span>
          </div>
        </FieldGroup>
      </div>

      <div className="space-y-3">
        <SettingsCheckboxRow
          label="Allow priority queue entries"
          checked={value.allowPriorityQueueEntries}
          onChange={(checked) => onChange({ ...value, allowPriorityQueueEntries: checked })}
        />
        <SettingsCheckboxRow
          label="Default filter to today"
          checked={value.defaultFilterToToday}
          onChange={(checked) => onChange({ ...value, defaultFilterToToday: checked })}
        />
        <SettingsCheckboxRow
          label="Show estimated wait time to patients"
          checked={value.showWaitTimeEstimates}
          onChange={(checked) => onChange({ ...value, showWaitTimeEstimates: checked })}
        />
      </div>
    </>
  );
}

