import { MedicineFormModal, MedicinesPageHeader, MedicinesTableCard } from "./components";
import { MedicinesPageProvider, useMedicinesPageContext } from "./context/medicines-page.context";
import { useMedicinesData } from "./hooks";

export function MedicinesPage() {
  return (
    <MedicinesPageProvider>
      <MedicinesPageContent />
    </MedicinesPageProvider>
  );
}

function MedicinesPageContent() {
  const { modalOpen, editingMedicine, openCreateModal, openEditModal, closeModal } =
    useMedicinesPageContext();

  const { rows, isBusy, medicinesQuery, deleteMutation, submitMedicine } = useMedicinesData({
    onSettledSuccess: closeModal
  });

  return (
    <div className="space-y-5">
      <MedicinesPageHeader onCreate={openCreateModal} />

      <MedicinesTableCard
        rows={rows}
        isLoading={medicinesQuery.isLoading}
        isDeleting={deleteMutation.isPending}
        onEdit={openEditModal}
        onDelete={(medicineId) => deleteMutation.mutate(medicineId)}
      />

      <MedicineFormModal
        open={modalOpen}
        medicine={editingMedicine}
        loading={isBusy}
        onClose={closeModal}
        onSubmit={(values) => submitMedicine({ medicine: editingMedicine, values })}
      />
    </div>
  );
}
