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
  const { selectedStatus, setStatus } = usePrescriptionsPageContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const { allRows, rows, counts, prescriptionsQuery, dispenseMutation } = usePrescriptionsData({
    selectedStatus,
    searchTerm
  });
  const roles = meQuery.data?.member.roles ?? [];
  const canEditConsultation = roles.includes("DOCTOR") || roles.includes("ADMIN");

  const handleDispense = async (prescriptionId: string) => {
    try {
      await dispenseMutation.mutateAsync(prescriptionId);
      setSelectedPrescription(null);
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
        searchTerm={searchTerm}
        isLoading={prescriptionsQuery.isLoading}
        canEditConsultation={canEditConsultation}
        dataUpdatedAt={prescriptionsQuery.dataUpdatedAt}
        onStatusChange={setStatus}
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
        onClose={() => setSelectedPrescription(null)}
        onDispense={handleDispense}
      />
    </div>
  );
}
