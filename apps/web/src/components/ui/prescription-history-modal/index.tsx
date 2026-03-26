import { format } from "date-fns";
import { useMemo } from "react";
import { Badge, RightPanelModal, SectionDivider } from "@/components/ui";
import type { Prescription } from "@/services/prescription.service";

type PrescriptionHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  patientName: string;
  prescriptions: Prescription[];
  allergyNote?: string;
};

export function PrescriptionHistoryModal({
  open,
  onClose,
  patientName,
  prescriptions,
  allergyNote
}: PrescriptionHistoryModalProps) {
  const totalMedicines = useMemo(
    () => prescriptions.reduce((sum, prescription) => sum + prescription.items.length, 0),
    [prescriptions]
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, Prescription[]>();
    for (const prescription of prescriptions) {
      const key = format(new Date(prescription.createdAt), "yyyy-MM-dd");
      const current = groups.get(key) ?? [];
      groups.set(key, [...current, prescription]);
    }
    return Array.from(groups.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([dateKey, items]) => ({ dateKey, items }));
  }, [prescriptions]);

  return (
    <RightPanelModal
      open={open}
      onClose={onClose}
      title="Prescription History"
      description={`${patientName} · All previous prescriptions`}
      iconName="table-2"
      variant="success"
      panelClassName="max-w-lg"
      titleBadge={
        <Badge tone="success" size="sm">
          {totalMedicines} medicines
        </Badge>
      }
      footer={null}
    >
      <div className="space-y-5">
        {allergyNote?.trim() ? (
          <div className="rounded-lg border border-danger/40 bg-danger-soft/20 px-3 py-2 text-sm text-danger">
            <p className="font-semibold">Allergy: {allergyNote}</p>
          </div>
        ) : null}

        {grouped.length === 0 ? (
          <p className="text-sm text-neutral-70">No prescriptions found.</p>
        ) : (
          grouped.map((group) => (
            <div key={group.dateKey} className="space-y-2">
              <SectionDivider
                label={format(new Date(group.dateKey), "MMM d, yyyy")}
                iconName="calendarDays"
                showLeadingLine={false}
                className="w-full"
              />

              <div className="overflow-hidden rounded-md border border-subtle bg-neutral-30/60">
                {group.items
                  .flatMap((prescription) => prescription.items)
                  .map((item, index, allItems) => (
                    <div key={`${group.dateKey}-${item.medicineId}-${index}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-soft text-2xs font-semibold text-success">
                            {index + 1}
                          </span>
                          <p className="truncate text-xs font-semibold text-neutral-95">
                            {item.medicineName}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          {item.dosage ? (
                            <Badge tone="neutral" size="sm" variant="capitalize">
                              {item.dosage}
                            </Badge>
                          ) : null}
                          {item.frequency ? (
                            <Badge tone="neutral" size="sm" variant="capitalize">
                              {item.frequency}
                            </Badge>
                          ) : null}
                          {item.duration ? (
                            <Badge
                              tone={
                                item.duration.toLowerCase().includes("ongoing")
                                  ? "warning"
                                  : "neutral"
                              }
                              size="sm"
                              variant="capitalize"
                            >
                              {item.duration}
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      {index < allItems.length - 1 ? (
                        <span className="block h-px bg-subtle" />
                      ) : null}
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </RightPanelModal>
  );
}
