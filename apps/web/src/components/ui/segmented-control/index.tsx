import { Children, cloneElement, createContext, isValidElement, useContext, type ReactNode } from "react";
import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import { segmentedControlStyles } from "./segmented-control.tv";

type SegmentedOption = {
  value: string;
  label: string;
  iconName?: IconName;
  disabled?: boolean;
};

type SegmentedControlContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const SegmentedControlContext = createContext<SegmentedControlContextValue | null>(null);

type SegmentedControlProps = {
  value: string;
  onValueChange: (value: string) => void;
  options?: SegmentedOption[];
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
};

type SegmentedControlItemProps = {
  value: string;
  iconName?: IconName;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

function SegmentedControlItem({
  value,
  iconName,
  disabled,
  className,
  children,
  fullWidth
}: SegmentedControlItemProps) {
  const context = useContext(SegmentedControlContext);

  if (!context) {
    throw new Error("SegmentedControl.Item must be used within SegmentedControl");
  }

  const styles = segmentedControlStyles();
  const Icon = iconName ? iconMap[iconName] : null;
  const selected = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      className={cn(
        styles.item(),
        fullWidth ? styles.itemFullWidth() : null,
        selected ? styles.itemSelected() : styles.itemUnselected(),
        className
      )}
      onClick={() => {
        if (!disabled) {
          context.onValueChange(value);
        }
      }}
    >
      {Icon ? <Icon size={14} aria-hidden className={styles.icon()} /> : null}
      {children}
    </button>
  );
}

function SegmentedControlRoot({
  value,
  onValueChange,
  options,
  children,
  className,
  fullWidth
}: SegmentedControlProps) {
  const styles = segmentedControlStyles();
  const segmentCount = Math.max(options?.length ?? Children.count(children), 1);

  return (
    <SegmentedControlContext.Provider value={{ value, onValueChange }}>
      <div
        role="tablist"
        className={cn(styles.root(), fullWidth ? styles.rootFullWidth() : null, className)}
        style={fullWidth ? { gridTemplateColumns: `repeat(${segmentCount}, minmax(0, 1fr))` } : undefined}
      >
        {options
          ? options.map((option) => (
              <SegmentedControlItem
                key={option.value}
                value={option.value}
                iconName={option.iconName}
                disabled={option.disabled}
                fullWidth={fullWidth}
              >
                {option.label}
              </SegmentedControlItem>
            ))
          : Children.map(children, (child) => {
              if (!isValidElement<SegmentedControlItemProps>(child)) {
                return child;
              }

              return cloneElement(child, { fullWidth });
            })}
      </div>
    </SegmentedControlContext.Provider>
  );
}

type SegmentedControlComponent = typeof SegmentedControlRoot & {
  Item: typeof SegmentedControlItem;
};

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem
}) as SegmentedControlComponent;

export type { SegmentedOption };
