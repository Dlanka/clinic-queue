import { useState } from "react";
import {
  PrescriptionDetailsModal,
  PrescriptionsPageHeader,
  PrescriptionsStatsGrid,
  PrescriptionsTableCard
} from "./components";
import {
  PrescriptionsPageProvider,
  usePrescriptionsPageContext
} from "./context/prescriptions-page.context";
import { usePrescriptionsData } from "./hooks";
import { useMe } from "@/hooks/use-me";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import { useNavigate } from "@tanstack/react-router";
import type { Prescription } from "@/services/prescription.service";

export function PrescriptionsPage() {
  return (
    <PrescriptionsPageProvider>
      <PrescriptionsPageContent />
    </PrescriptionsPageProvider>
  );
}

function PrescriptionsPageContent() {
  const navigate = useNavigate();
  const meQuery = useMe();
  const settingsQuery = useTenantSettings();
  const { selectedStatus, setStatus } = usePrescriptionsPageContext();
  const [selectedDateFilter, setSelectedDateFilter] = useState<"TODAY" | "ALL" | string>("TODAY");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const { allRows, rows, dateFilterOptions, counts, prescriptionsQuery, dispenseMutation } =
    usePrescriptionsData({
      selectedStatus,
      selectedDateFilter,
      searchTerm
    });
  const roles = meQuery.data?.member.roles ?? [];
  const pharmacySettings = settingsQuery.data?.pharmacy;
  const canEditConsultation = roles.includes("DOCTOR") || roles.includes("ADMIN");
  const canDispense = roles.includes("PHARMACY_STAFF") || roles.includes("ADMIN");
  const canPrint = canDispense;
  const canEditPrescribed = pharmacySettings?.allowEditBeforeDispense ?? true;
  const canEditDispensed = pharmacySettings?.allowEditAfterDispense ?? false;

  const handleDispense = async (prescriptionId: string) => {
    try {
      await dispenseMutation.mutateAsync(prescriptionId);
    } catch {
      // toast handled by mutation onError
    }
  };

  return (
    <div className="space-y-5">
      <PrescriptionsPageHeader />

      <PrescriptionsStatsGrid counts={counts} />

      <PrescriptionsTableCard
        allRows={allRows}
        rows={rows}
        selectedStatus={selectedStatus}
        selectedDateFilter={selectedDateFilter}
        dateFilterOptions={dateFilterOptions}
        searchTerm={searchTerm}
        isLoading={prescriptionsQuery.isLoading}
        canEditConsultation={canEditConsultation}
        canEditPrescribed={canEditPrescribed}
        canEditDispensed={canEditDispensed}
        dataUpdatedAt={prescriptionsQuery.dataUpdatedAt}
        onStatusChange={setStatus}
        onDateFilterChange={setSelectedDateFilter}
        onSearch={setSearchTerm}
        onRefresh={() => prescriptionsQuery.refetch()}
        onViewDetails={setSelectedPrescription}
        onEditConsultation={(queueEntryId) =>
          navigate({
            to: "/consultation/$queueId",
            params: { queueId: queueEntryId },
            search: { amend: true }
          })
        }
      />

      <PrescriptionDetailsModal
        open={Boolean(selectedPrescription)}
        prescription={selectedPrescription}
        dispensing={dispenseMutation.isPending}
        canDispense={canDispense}
        canPrint={canPrint}
        onClose={() => setSelectedPrescription(null)}
        onDispense={handleDispense}
      />
    </div>
  );
}
