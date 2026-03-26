import { useEffect, useMemo, useState } from "react";
import {
  PatientDetailCard,
  PatientFormModal,
  PatientsPageHeader,
  PatientsTableCard
} from "./components";
import { PatientsPageProvider, usePatientsPageContext } from "./context/patients-page.context";
import { usePatientsData } from "./hooks";

interface PatientsPageProps {
  initialPatientId?: string;
  consultationMode?: boolean;
}

export function PatientsPage({
  initialPatientId,
  consultationMode = false
}: PatientsPageProps = {}) {
  return (
    <PatientsPageProvider>
      <PatientsPageContent
        initialPatientId={initialPatientId}
        consultationMode={consultationMode}
      />
    </PatientsPageProvider>
  );
}

function PatientsPageContent({
  initialPatientId,
  consultationMode
}: {
  initialPatientId?: string;
  consultationMode: boolean;
}) {
  const {
    modalOpen,
    editingPatient,
    selectedPatientId,
    openCreateModal,
    openEditModal,
    closeModal,
    selectPatient
  } = usePatientsPageContext();

  const {
    rows,
    patientsQuery,
    selectedPatientQuery,
    visitsQuery,
    prescriptionsQuery,
    deletePatientMutation,
    isPatientSaving,
    submitPatient
  } = usePatientsData({
    selectedPatientId,
    onPatientSettledSuccess: closeModal
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedPatientId) {
      return;
    }

    if (initialPatientId) {
      const initialPatient = rows.find((row) => row.id === initialPatientId);
      if (initialPatient) {
        selectPatient(initialPatient.id);
        return;
      }
    }

    const firstPatient = rows[0];
    if (firstPatient) {
      selectPatient(firstPatient.id);
    }
  }, [initialPatientId, rows, selectPatient, selectedPatientId]);

  const filteredRows = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) {
      return rows;
    }

    return rows.filter(
      (row) =>
        row.fullName.toLowerCase().includes(normalizedTerm) ||
        (row.phone ?? "").toLowerCase().includes(normalizedTerm)
    );
  }, [rows, searchTerm]);

  return (
    <div className="space-y-5 flex flex-col h-full">
      <PatientsPageHeader
        title={consultationMode ? "Consultation" : "Patients"}
        subtitle={
          consultationMode
            ? "Record symptoms, diagnosis, visits, and prescriptions."
            : "Manage patient registry and clinical visit history."
        }
        patientCount={rows.length}
        hideCreateButton={consultationMode}
        onCreate={openCreateModal}
      />

      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)] flex-1 max-h-full h-full">
        <PatientsTableCard
          rows={filteredRows}
          isLoading={patientsQuery.isLoading}
          selectedPatientId={selectedPatientId}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onSelect={selectPatient}
        />

        <PatientDetailCard
          patient={selectedPatientQuery.data ?? null}
          visits={visitsQuery.data ?? []}
          prescriptions={prescriptionsQuery.data ?? []}
          visitsLoading={visitsQuery.isLoading}
          onEdit={openEditModal}
          onDeactivate={(patientId) => deletePatientMutation.mutate(patientId)}
          isDeactivating={deletePatientMutation.isPending}
        />
      </div>

      <PatientFormModal
        open={modalOpen}
        patient={editingPatient}
        loading={isPatientSaving}
        onClose={closeModal}
        onSubmit={(values) => submitPatient({ patient: editingPatient, values })}
      />
    </div>
  );
}
