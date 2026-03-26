import { cn } from "@/lib/cn";

type SettingsCheckboxRowProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export function SettingsCheckboxRow({
  label,
  checked,
  onChange,
  className
}: SettingsCheckboxRowProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3",
        checked ? "border-primary/20 bg-primary-soft/30" : "border-subtle bg-neutral-20/60",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 rounded border border-subtle bg-neutral-30 text-primary accent-(--color-primary)"
      />
      <span className="text-sm font-medium text-neutral-90">{label}</span>
    </label>
  );
}
