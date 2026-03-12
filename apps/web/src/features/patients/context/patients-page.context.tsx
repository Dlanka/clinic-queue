import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Patient } from "@/services/patient.service";
import type { Visit } from "@/services/visit.service";
import {
  createInitialPatientsUiState,
  type PatientsUiState
} from "../store/patients.store";

type PatientsPageContextValue = PatientsUiState & {
  openCreateModal: () => void;
  openEditModal: (patient: Patient) => void;
  closeModal: () => void;
  selectPatient: (patientId: string) => void;
  openPrescriptionModal: (visit: Visit) => void;
  closePrescriptionModal: () => void;
};

const PatientsPageContext = createContext<PatientsPageContextValue | null>(null);

export function PatientsPageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PatientsUiState>(createInitialPatientsUiState);

  const value = useMemo<PatientsPageContextValue>(
    () => ({
      ...state,
      openCreateModal: () =>
        setState((prev) => ({
          ...prev,
          modalOpen: true,
          editingPatient: null
        })),
      openEditModal: (patient: Patient) =>
        setState((prev) => ({
          ...prev,
          modalOpen: true,
          editingPatient: patient
        })),
      closeModal: () =>
        setState((prev) => ({
          ...prev,
          modalOpen: false,
          editingPatient: null
        })),
      openPrescriptionModal: (visit: Visit) =>
        setState((prev) => ({
          ...prev,
          prescriptionModalOpen: true,
          prescriptionVisit: visit
        })),
      closePrescriptionModal: () =>
        setState((prev) => ({
          ...prev,
          prescriptionModalOpen: false,
          prescriptionVisit: null
        })),
      selectPatient: (patientId: string) =>
        setState((prev) => ({
          ...prev,
          selectedPatientId: patientId
        }))
    }),
    [state]
  );

  return <PatientsPageContext.Provider value={value}>{children}</PatientsPageContext.Provider>;
}

export function usePatientsPageContext() {
  const context = useContext(PatientsPageContext);
  if (!context) {
    throw new Error("usePatientsPageContext must be used within PatientsPageProvider");
  }

  return context;
}
