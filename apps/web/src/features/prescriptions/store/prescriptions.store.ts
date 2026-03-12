import type { Prescription } from "@/services/prescription.service";

export const prescriptionsQueryKey = ["prescriptions"] as const;

export type PrescriptionsUiState = {
  selectedStatus: "ALL" | "PRESCRIBED" | "DISPENSED";
  selectedPrescription: Prescription | null;
};

export const createInitialPrescriptionsUiState = (): PrescriptionsUiState => ({
  selectedStatus: "ALL",
  selectedPrescription: null
});
