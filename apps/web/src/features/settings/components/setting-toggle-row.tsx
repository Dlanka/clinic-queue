import { Switch } from "@/components/ui";

type SettingToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
};

export function SettingToggleRow({
  label,
  description,
  checked,
  onCheckedChange
}: SettingToggleRowProps) {
  return (
    <div className="rounded-md border border-subtle bg-neutral-20 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-neutral-95">{label}</p>
          {description ? <p className="text-xs text-neutral-70">{description}</p> : null}
        </div>
        <Switch checked={checked} label={checked ? "Enabled" : "Disabled"} onCheckedChange={onCheckedChange} />
      </div>
    </div>
  );
}

