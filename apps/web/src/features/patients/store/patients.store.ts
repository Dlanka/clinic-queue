import type { Patient } from "@/services/patient.service";
import type { Visit } from "@/services/visit.service";

export const patientsQueryKey = ["patients"] as const;
export const doctorsQueryKey = ["doctors"] as const;

export type PatientsUiState = {
  modalOpen: boolean;
  editingPatient: Patient | null;
  selectedPatientId: string | null;
  prescriptionModalOpen: boolean;
  prescriptionVisit: Visit | null;
};

export const createInitialPatientsUiState = (): PatientsUiState => ({
  modalOpen: false,
  editingPatient: null,
  selectedPatientId: null,
  prescriptionModalOpen: false,
  prescriptionVisit: null
});
