import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { radioChipGroupStyles } from "./radio-chip-group.tv";

type RadioChipColor = "primary" | "secondary" | "neutral" | "success" | "warning" | "danger" | "info";

type RadioChipOption = {
  value: string;
  label: string;
  color?: RadioChipColor;
  disabled?: boolean;
};

type RadioChipGroupProps = {
  options: RadioChipOption[];
  value?: string;
  onValueChange: (nextValue: string) => void;
  className?: string;
  disabled?: boolean;
};

const dotColorClassMap: Record<RadioChipColor, string> = {
  primary: "bg-primary",
  secondary: "bg-neutral-80",
  neutral: "bg-neutral-70",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info"
};

export function RadioChipGroup({
  options,
  value,
  onValueChange,
  className,
  disabled = false
}: RadioChipGroupProps) {
  const styles = radioChipGroupStyles();

  return (
    <div role="radiogroup" className={cn(styles.root(), className)}>
      {options.map((option) => {
        const selected = option.value === value;
        const color = option.color ?? "primary";
        const isDisabled = disabled || option.disabled;

        return (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            preventAnimation
            variant={selected ? "tonal" : "outlined"}
            intent={selected ? color : "neutral"}
            className={styles.item()}
            disabled={isDisabled}
            onClick={() => onValueChange(option.value)}
          >
            <span className={cn(styles.dot(), dotColorClassMap[color])} />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
