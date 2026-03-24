import { format } from "date-fns";
import {
  Badge,
  Button,
  CenterModal,
  EmptyState
} from "@/components/ui";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import type { Prescription } from "@/services/prescription.service";

type PrescriptionDetailsModalProps = {
  open: boolean;
  prescription: Prescription | null;
  dispensing: boolean;
  onClose: () => void;
  onDispense: (prescriptionId: string) => void;
};

export function PrescriptionDetailsModal({
  open,
  prescription,
  dispensing,
  onClose,
  onDispense
}: PrescriptionDetailsModalProps) {
  const isDispensed = prescription?.status === "DISPENSED";

  return (
    <CenterModal
      open={open}
      onClose={onClose}
      iconName="clipboardList"
      variant={isDispensed ? "success" : "info"}
      title={prescription ? `RX-${prescription.id.slice(-4).toUpperCase()}` : "Prescription Details"}
      description={
        prescription
          ? `${prescription.patientName} · ${formatDoctorDisplayName(prescription.doctorName)}`
          : "Review medicines before dispensing."
      }
      className="w-[min(94vw,64rem)]"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button size="sm" variant="outlined" intent="neutral" onClick={onClose}>
            Close
          </Button>
          {prescription && !isDispensed ? (
            <Button
              size="sm"
              intent="success"
              startIconName="check"
              disabled={dispensing}
              onClick={() => onDispense(prescription.id)}
            >
              Dispense Medicines
            </Button>
          ) : null}
        </div>
      }
    >
      {!prescription ? (
        <EmptyState
          title="No prescription selected"
          description="Select a prescription row to view medicine details."
          iconName="clipboardList"
          className="min-h-56"
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-lg border border-subtle bg-neutral-20 p-4 md:grid-cols-4">
            <div>
              <p className="text-2xs uppercase tracking-section text-neutral-70">Patient</p>
              <p className="text-sm font-semibold text-neutral-95">{prescription.patientName}</p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-section text-neutral-70">Doctor</p>
              <p className="text-sm font-semibold text-neutral-95">
                {formatDoctorDisplayName(prescription.doctorName)}
              </p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-section text-neutral-70">Created</p>
              <p className="text-sm font-semibold text-neutral-95">
                {format(new Date(prescription.createdAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>
            <div>
              <p className="text-2xs uppercase tracking-section text-neutral-70">Status</p>
              <Badge tone={isDispensed ? "success" : "warning"}>
                {prescription.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-section text-neutral-70">
              Medicine Items
            </p>
            <div className="space-y-2">
              {prescription.items.map((item) => (
                <div
                  key={`${prescription.id}-${item.medicineId}`}
                  className="rounded-lg border border-subtle bg-neutral-20 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-neutral-95">{item.medicineName}</p>
                    <Badge tone="neutral" size="sm">
                      Qty {item.quantity}
                    </Badge>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
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
                      <Badge tone="neutral" size="sm" variant="capitalize">
                        {item.duration}
                      </Badge>
                    ) : null}
                  </div>

                  {item.instructions ? (
                    <p className="mt-2 text-xs text-neutral-70">{item.instructions}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CenterModal>
  );
}
