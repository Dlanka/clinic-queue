import { Button } from "@/components/ui/button";

type FilterChipIntent =
  | "primary"
  | "secondary"
  | "neutral"
  | "ghost"
  | "danger"
  | "error"
  | "success"
  | "warning"
  | "info";

export interface FilterChipItem<TValue extends string> {
  value: TValue;
  label: string;
  intent: FilterChipIntent;
  count?: number;
}

interface FilterChipGroupProps<TValue extends string> {
  items: Array<FilterChipItem<TValue>>;
  selectedValue: TValue;
  onChange: (value: TValue) => void;
  className?: string;
}

export function FilterChipGroup<TValue extends string>({
  items,
  selectedValue,
  onChange,
  className
}: FilterChipGroupProps<TValue>) {
  return (
    <div className={className}>
      {items.map((item) => {
        const selected = selectedValue === item.value;

        return (
          <Button
            key={item.value}
            size="sm"
            variant={selected ? "tonal" : "text"}
            intent={selected ? item.intent : "ghost"}
            preventAnimation
            className={
              selected
                ? "border border-current/30"
                : "border border-transparent text-neutral-70 hover:text-neutral-90"
            }
            onClick={() => onChange(item.value)}
          >
            {item.label}
            {typeof item.count === "number" ? (
              <span className="rounded-full bg-neutral-90/20 px-1.5 text-2xs text-neutral-70">
                {item.count}
              </span>
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}
