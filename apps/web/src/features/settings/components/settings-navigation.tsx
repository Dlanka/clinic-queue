import { SectionNavigation } from "@/components/ui";
import type { SettingsNavItem, SettingsTab } from "../settings.types";

type SettingsNavigationProps = {
  items: SettingsNavItem[];
  activeTab: SettingsTab;
  onChange: (value: SettingsTab) => void;
};

export function SettingsNavigation({ items, activeTab, onChange }: SettingsNavigationProps) {
  return (
    <SectionNavigation
      title="Configuration"
      items={items}
      activeValue={activeTab}
      onChange={onChange}
    />
  );
}
