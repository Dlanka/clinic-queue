import { Switch } from "@/components/ui";
import { cn } from "@/lib/cn";

export type SettingsSwitchGroupItem<TKey extends string = string> = {
  key: TKey;
  title: string;
  description?: string;
  enabled: boolean;
};

type SettingsSwitchGroupProps<TKey extends string = string> = {
  items: SettingsSwitchGroupItem<TKey>[];
  onToggle: (key: TKey, next: boolean) => void;
};

export function SettingsSwitchGroup<TKey extends string = string>({
  items,
  onToggle
}: SettingsSwitchGroupProps<TKey>) {
  return (
    <div className="overflow-hidden rounded-xl border border-subtle bg-neutral-40/30">
      {items.map((item, index) => (
        <div
          key={item.key}
          className={cn(
            "flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-neutral-40",
            index > 0 ? "border-t border-subtle" : null
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-90">{item.title}</p>
            {item.description ? (
              <p className="text-2xs text-neutral-70">{item.description}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-4 justify-end">
            <span
              className={cn(
                "text-2xs font-semibold",
                item.enabled ? "text-success" : "text-neutral-70"
              )}
            >
              {item.enabled ? "Enabled" : "Disabled"}
            </span>
            <Switch
              checked={item.enabled}
              label=""
              onCheckedChange={(next) => onToggle(item.key, next)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
