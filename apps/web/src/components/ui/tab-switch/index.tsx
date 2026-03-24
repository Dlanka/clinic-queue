import type { IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";
import { Button } from "../button";

export interface TabSwitchItem<TValue extends string> {
  value: TValue;
  label: ReactNode;
  iconName?: IconName;
}

interface TabSwitchProps<TValue extends string> {
  value: TValue;
  items: TabSwitchItem<TValue>[];
  onChange: (value: TValue) => void;
  className?: string;
}

export function TabSwitch<TValue extends string>({
  value,
  items,
  onChange,
  className
}: TabSwitchProps<TValue>) {
  return (
    <div className={cn("border-b border-subtle", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        {items.map((item) => {
          const selected = item.value === value;

          return (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant="text"
              intent={selected ? "info" : "neutral"}
              startIconName={item.iconName}
              preventAnimation
              className={cn(
                "rounded-none hover:bg-transparent",
                selected ? "border-b border-primary" : "text-neutral-70 hover:text-neutral-90"
              )}
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
