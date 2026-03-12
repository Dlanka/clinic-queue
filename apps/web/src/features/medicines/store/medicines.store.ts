import type { Medicine } from "@/services/medicine.service";

export const medicinesQueryKey = ["medicines"] as const;

export type MedicinesUiState = {
  modalOpen: boolean;
  editingMedicine: Medicine | null;
};

export const createInitialMedicinesUiState = (): MedicinesUiState => ({
  modalOpen: false,
  editingMedicine: null
});
