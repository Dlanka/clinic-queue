import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Checkbox,
  CollapsibleSection,
  EmptyState,
  RightPanelModal,
  SectionDivider,
  useToast
} from "@/components/ui";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import { VisitService } from "@/services/visit.service";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import { PrescriptionService, type Prescription } from "@/services/prescription.service";

type PrescriptionDetailsModalProps = {
  open: boolean;
  prescription: Prescription | null;
  dispensing: boolean;
  canDispense: boolean;
  canPrint: boolean;
  onClose: () => void;
  onDispense: (prescriptionId: string) => void | Promise<void>;
};

function ReadOnlyField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1.5">
      <SectionDivider
        label={label}
        iconName="clipboardList"
        showLeadingLine={false}
        showTrailingLine={false}
        className="w-full"
      />
      <div className="rounded-md border border-subtle bg-neutral-20/70 px-4 py-3 text-sm text-neutral-90">
        {value?.trim() ? value : "-"}
      </div>
    </div>
  );
}

function parseThermalWidth(template?: string): 58 | 80 {
  const normalized = template?.toLowerCase() ?? "";
  if (normalized.includes("58")) {
    return 58;
  }
  return 80;
}

export function PrescriptionDetailsModal({
  open,
  prescription,
  dispensing,
  canDispense,
  canPrint,
  onClose,
  onDispense
}: PrescriptionDetailsModalProps) {
  const toast = useToast();
  const settingsQuery = useTenantSettings(open);
  const [showClinicalContext, setShowClinicalContext] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [printOnDispense, setPrintOnDispense] = useState(false);

  const pharmacySettings = settingsQuery.data?.pharmacy;

  useEffect(() => {
    if (!open) {
      return;
    }

    setPrintOnDispense(Boolean(pharmacySettings?.printEnabledByDefaultOnDispense));
  }, [open, pharmacySettings?.printEnabledByDefaultOnDispense]);

  const isDispensed = prescription?.status === "DISPENSED";

  const visitsQuery = useQuery({
    queryKey: ["patient-visits", prescription?.patientId],
    queryFn: () => VisitService.listByPatient(String(prescription?.patientId)),
    enabled: open && Boolean(prescription?.patientId)
  });

  const currentVisit =
    visitsQuery.data?.find((visit) => visit.id === prescription?.visitId) ?? null;

  const handlePrint = async () => {
    if (!prescription || printing) {
      return;
    }

    try {
      setPrinting(true);
      const paperWidth = parseThermalWidth(pharmacySettings?.thermalPrintTemplate);
      const pdfBlob = await PrescriptionService.print(prescription.id, paperWidth);
      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, "_blank", "noopener,noreferrer");

      if (printWindow) {
        printWindow.addEventListener(
          "load",
          () => {
            printWindow.print();
          },
          { once: true }
        );
      } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `prescription-${prescription.id.slice(-6).toUpperCase()}.pdf`;
        downloadLink.click();
      }

      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to generate print file";
      toast.error("Print failed", message);
    } finally {
      setPrinting(false);
    }
  };

  const handleDispense = async () => {
    if (!prescription || isDispensed || dispensing || printing) {
      return;
    }

    try {
      await onDispense(prescription.id);

      if (printOnDispense) {
        await handlePrint();
      }

      onClose();
    } catch {
      // Toast is handled in page mutation for dispense; print toast is handled in handlePrint
    }
  };

  return (
    <RightPanelModal
      open={open}
      onClose={onClose}
      title="Prescription Details"
      description="Review medicines before dispensing"
      iconName="pill"
      variant="warning"
      panelClassName="max-w-2xl"
      headerContent={
        prescription ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
                RX-{prescription.id.slice(-4).toUpperCase()}
              </span>
              <p className="text-sm font-semibold text-neutral-95">{prescription.patientName}</p>
              <p className="text-xs text-neutral-70">
                {formatDoctorDisplayName(prescription.doctorName)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-70">
              <span>{format(new Date(prescription.createdAt), "MMM d, yyyy h:mm a")}</span>
              <span>-</span>
              <Badge tone={isDispensed ? "success" : "warning"} size="sm">
                {isDispensed ? "Dispensed" : "Prescribed"}
              </Badge>
            </div>
          </div>
        ) : null
      }
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <div className="min-h-5">
            {canDispense && prescription && !isDispensed ? (
              <Checkbox
                id="prescription-print-on-dispense"
                label="Print after dispense"
                checked={printOnDispense}
                disabled={dispensing || printing}
                onChange={(event) => setPrintOnDispense(event.target.checked)}
              />
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {canPrint ? (
              <Button
                size="sm"
                variant="outlined"
                intent="neutral"
                startIconName="printer"
                disabled={!prescription || printing || dispensing}
                onClick={handlePrint}
              >
                {printing ? "Generating..." : "Print"}
              </Button>
            ) : null}
            <Button size="sm" variant="outlined" intent="neutral" onClick={onClose}>
              Close
            </Button>
            {canDispense && prescription && !isDispensed ? (
              <Button
                size="sm"
                intent="success"
                startIconName="check"
                disabled={dispensing || printing}
                onClick={handleDispense}
              >
                {printOnDispense ? "Dispense & Print" : "Dispense"}
              </Button>
            ) : null}
          </div>
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
        <div className="space-y-5">
          <div className="space-y-2">
            <SectionDivider
              label="Medicines"
              iconName="table-2"
              showLeadingLine={false}
              className="w-full"
            />
            <div className="space-y-2">
              {prescription.items.map((item, index) => (
                <div
                  key={`${prescription.id}-${item.medicineId}-${index}`}
                  className="rounded-sm border border-subtle bg-neutral-40 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-soft text-2xs font-semibold text-success">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold text-neutral-90">{item.medicineName}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.dosage ? (
                        <Badge tone="info" size="sm" variant="capitalize">
                          {item.dosage}
                        </Badge>
                      ) : null}
                      {item.frequency ? (
                        <Badge tone="info" size="sm" variant="capitalize">
                          {item.frequency}
                        </Badge>
                      ) : null}
                      {item.duration ? (
                        <Badge tone="info" size="sm" variant="capitalize">
                          {item.duration}
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  {item.instructions ? (
                    <p className="mt-2 text-xs text-neutral-70">{item.instructions}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-subtle"></div>

          <div className="space-y-2">
            <CollapsibleSection
              label="Clinical Context"
              iconName="activity"
              open={showClinicalContext}
              onToggle={() => setShowClinicalContext((prev) => !prev)}
              loading={visitsQuery.isLoading}
              loadingText="Loading clinical context..."
              contentClassName="space-y-3"
            >
              <ReadOnlyField label="Symptoms" value={currentVisit?.symptoms} />
              <ReadOnlyField label="Diagnosis" value={currentVisit?.diagnosis} />
              <ReadOnlyField label="Notes" value={currentVisit?.notes} />
            </CollapsibleSection>

            <CollapsibleSection
              label="Vitals"
              iconName="heart"
              open={showVitals}
              onToggle={() => setShowVitals((prev) => !prev)}
              loading={visitsQuery.isLoading}
              loadingText="Loading vitals..."
              contentClassName="grid gap-2 sm:grid-cols-2"
            >
              <div className="rounded-md border border-subtle bg-neutral-20 px-3 py-2">
                <p className="text-2xs uppercase tracking-section text-neutral-70">BP</p>
                <p className="text-sm font-semibold text-neutral-95">
                  {currentVisit?.bloodPressure || "-"}
                </p>
              </div>
              <div className="rounded-md border border-subtle bg-neutral-20 px-3 py-2">
                <p className="text-2xs uppercase tracking-section text-neutral-70">Pulse</p>
                <p className="text-sm font-semibold text-neutral-95">
                  {currentVisit?.pulse ?? "-"}
                </p>
              </div>
              <div className="rounded-md border border-subtle bg-neutral-20 px-3 py-2">
                <p className="text-2xs uppercase tracking-section text-neutral-70">Temp</p>
                <p className="text-sm font-semibold text-neutral-95">
                  {currentVisit?.temperature ?? "-"}
                </p>
              </div>
              <div className="rounded-md border border-subtle bg-neutral-20 px-3 py-2">
                <p className="text-2xs uppercase tracking-section text-neutral-70">Weight</p>
                <p className="text-sm font-semibold text-neutral-95">
                  {currentVisit?.weight ?? "-"}
                </p>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      )}
    </RightPanelModal>
  );
}
