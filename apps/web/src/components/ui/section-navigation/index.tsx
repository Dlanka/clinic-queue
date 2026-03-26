import { iconMap, type IconName } from "@/config/icons";
import { cn } from "@/lib/cn";

export type SectionNavigationItem<TValue extends string = string> = {
  value: TValue;
  label: string;
  subtitle?: string;
  iconName: IconName;
};

type SectionNavigationProps<TValue extends string = string> = {
  title: string;
  items: SectionNavigationItem<TValue>[];
  activeValue: TValue;
  onChange: (value: TValue) => void;
  className?: string;
};

export function SectionNavigation<TValue extends string = string>({
  title,
  items,
  activeValue,
  onChange,
  className
}: SectionNavigationProps<TValue>) {
  return (
    <aside className={cn("overflow-hidden rounded-lg border border-subtle bg-neutral-30/90", className)}>
      <div className="px-4 py-4">
        <p className="text-3xs font-bold uppercase tracking-[0.14em] text-neutral-70">{title}</p>
      </div>

      <div className="divide-y divide-neutral-70/20 border-t border-subtle">
        {items.map((item) => {
          const Icon = iconMap[item.iconName];
          const active = activeValue === item.value;

          return (
            <button
              key={item.value}
              type="button"
              className={cn(
                "relative flex w-full items-center gap-3 px-4 py-2.5 text-left transition",
                active
                  ? "bg-primary-soft/70 text-primary before:absolute before:bottom-3 before:left-0 before:top-3 before:w-0.5 before:bg-primary before:shadow-[0_0_10px_var(--color-primary)]"
                  : "text-neutral-90 hover:bg-neutral-40/80 hover:text-neutral-100"
              )}
              onClick={() => onChange(item.value)}
            >
              <Icon size={16} className="mt-0.5 shrink-0" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold leading-tight">{item.label}</span>
                {item.subtitle ? (
                  <span className="mt-0.5 block truncate text-2xs font-medium text-neutral-70">
                    {item.subtitle}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

