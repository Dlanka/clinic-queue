import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Prescription } from "@/services/prescription.service";
import {
  createInitialPrescriptionsUiState,
  type PrescriptionsUiState
} from "../store/prescriptions.store";

type PrescriptionsPageContextValue = PrescriptionsUiState & {
  setStatus: (status: "ALL" | "PRESCRIBED" | "DISPENSED") => void;
  selectPrescription: (prescription: Prescription | null) => void;
};

const PrescriptionsPageContext = createContext<PrescriptionsPageContextValue | null>(null);

export function PrescriptionsPageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PrescriptionsUiState>(createInitialPrescriptionsUiState);

  const value = useMemo<PrescriptionsPageContextValue>(
    () => ({
      ...state,
      setStatus: (status) =>
        setState((prev) => ({
          ...prev,
          selectedStatus: status
        })),
      selectPrescription: (prescription) =>
        setState((prev) => ({
          ...prev,
          selectedPrescription: prescription
        }))
    }),
    [state]
  );

  return <PrescriptionsPageContext.Provider value={value}>{children}</PrescriptionsPageContext.Provider>;
}

export function usePrescriptionsPageContext() {
  const context = useContext(PrescriptionsPageContext);
  if (!context) {
    throw new Error("usePrescriptionsPageContext must be used within PrescriptionsPageProvider");
  }

  return context;
}
