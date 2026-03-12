import { useEffect } from "react";
import {
  PatientDetailCard,
  PatientFormModal,
  PrescriptionBuilderModal,
  PatientsPageHeader,
  PatientsTableCard
} from "./components";
import { PatientsPageProvider, usePatientsPageContext } from "./context/patients-page.context";
import { usePatientsData } from "./hooks";

export function PatientsPage() {
  return (
    <PatientsPageProvider>
      <PatientsPageContent />
    </PatientsPageProvider>
  );
}

function PatientsPageContent() {
  const {
    modalOpen,
    editingPatient,
    selectedPatientId,
    prescriptionModalOpen,
    prescriptionVisit,
    openCreateModal,
    openEditModal,
    closeModal,
    openPrescriptionModal,
    closePrescriptionModal,
    selectPatient
  } = usePatientsPageContext();

  const {
    rows,
    patientsQuery,
    doctorsQuery,
    medicineOptions,
    selectedPatientQuery,
    visitsQuery,
    deletePatientMutation,
    createVisitMutation,
    createPrescriptionMutation,
    isPatientSaving,
    submitPatient,
    submitVisit,
    submitPrescription
  } = usePatientsData({
    selectedPatientId,
    onPatientSettledSuccess: closeModal
  });

  useEffect(() => {
    const firstPatient = rows[0];

    if (!selectedPatientId && firstPatient) {
      selectPatient(firstPatient.id);
    }
  }, [rows, selectPatient, selectedPatientId]);

  return (
    <div className="space-y-5">
      <PatientsPageHeader onCreate={openCreateModal} />

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <PatientsTableCard
          rows={rows}
          isLoading={patientsQuery.isLoading}
          isDeleting={deletePatientMutation.isPending}
          selectedPatientId={selectedPatientId}
          onSelect={selectPatient}
          onEdit={openEditModal}
          onDeactivate={(patientId) => deletePatientMutation.mutate(patientId)}
        />

        <PatientDetailCard
          patient={selectedPatientQuery.data ?? null}
          visits={visitsQuery.data ?? []}
          visitsLoading={visitsQuery.isLoading}
          doctors={doctorsQuery.data ?? []}
          visitSaving={createVisitMutation.isPending}
          selectedPatientId={selectedPatientId}
          onOpenPrescriptionBuilder={openPrescriptionModal}
          onSubmitVisit={(values) => {
            if (!selectedPatientId) {
              return;
            }
            submitVisit({ patientId: selectedPatientId, values });
          }}
        />
      </div>

      <PatientFormModal
        open={modalOpen}
        patient={editingPatient}
        loading={isPatientSaving}
        onClose={closeModal}
        onSubmit={(values) => submitPatient({ patient: editingPatient, values })}
      />

      <PrescriptionBuilderModal
        open={prescriptionModalOpen}
        visit={prescriptionVisit}
        medicineOptions={medicineOptions}
        loading={createPrescriptionMutation.isPending}
        onClose={closePrescriptionModal}
        onSubmit={(values) => {
          if (!prescriptionVisit) {
            return;
          }

          submitPrescription(
            prescriptionVisit.id,
            values.items.map((item) => ({
              medicineId: item.medicineId,
              quantity: item.quantity,
              dosage: item.dosage || undefined,
              frequency: item.frequency || undefined,
              duration: item.duration || undefined,
              instructions: item.instructions || undefined
            }))
          );
          closePrescriptionModal();
        }}
      />
    </div>
  );
}
