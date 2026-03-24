import type { Patient } from "@/services/patient.service";

export const patientsQueryKey = ["patients"] as const;

export type PatientsUiState = {
  modalOpen: boolean;
  editingPatient: Patient | null;
  selectedPatientId: string | null;
};

export const createInitialPatientsUiState = (): PatientsUiState => ({
  modalOpen: false,
  editingPatient: null,
  selectedPatientId: null
});
