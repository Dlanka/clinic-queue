import { TabSwitch, type TabSwitchItem } from "@/components/ui";

interface ConsultationDetailTabsProps {
  activeTab: "clinical" | "prescription";
  prescriptionCount: number;
  onChange: (tab: "clinical" | "prescription") => void;
}

export function ConsultationDetailTabs({
  activeTab,
  prescriptionCount,
  onChange
}: ConsultationDetailTabsProps) {
  const items: TabSwitchItem<"clinical" | "prescription">[] = [
    { value: "clinical", label: "Clinical", iconName: "activity" },
    {
      value: "prescription",
      label: (
        <span className="inline-flex items-center gap-1.5">
          <span>Prescription</span>
          {prescriptionCount > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-success-soft px-1.5 text-2xs font-semibold text-success">
              {prescriptionCount}
            </span>
          ) : null}
        </span>
      ),
      iconName: "clipboardList"
    }
  ];

  return (
    <TabSwitch value={activeTab} items={items} onChange={onChange} />
  );
}
