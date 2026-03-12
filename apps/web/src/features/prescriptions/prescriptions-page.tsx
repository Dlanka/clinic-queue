import { PrescriptionsPageHeader, PrescriptionsTableCard } from "./components";
import {
  PrescriptionsPageProvider,
  usePrescriptionsPageContext
} from "./context/prescriptions-page.context";
import { usePrescriptionsData } from "./hooks";

export function PrescriptionsPage() {
  return (
    <PrescriptionsPageProvider>
      <PrescriptionsPageContent />
    </PrescriptionsPageProvider>
  );
}

function PrescriptionsPageContent() {
  const { selectedStatus, setStatus } = usePrescriptionsPageContext();
  const { rows, prescriptionsQuery, dispenseMutation } = usePrescriptionsData({
    selectedStatus
  });

  return (
    <div className="space-y-5">
      <PrescriptionsPageHeader selectedStatus={selectedStatus} onSelectStatus={setStatus} />

      <PrescriptionsTableCard
        rows={rows}
        isLoading={prescriptionsQuery.isLoading}
        isDispensing={dispenseMutation.isPending}
        onDispense={(prescriptionId) => dispenseMutation.mutate(prescriptionId)}
      />
    </div>
  );
}
