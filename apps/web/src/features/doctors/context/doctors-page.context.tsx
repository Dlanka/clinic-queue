import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Doctor } from "@/services/doctor.service";
import {
  createInitialDoctorsUiState,
  type DoctorsUiState
} from "../store/doctors.store";

type DoctorsPageContextValue = DoctorsUiState & {
  openCreateModal: () => void;
  openEditModal: (doctor: Doctor) => void;
  closeModal: () => void;
};

const DoctorsPageContext = createContext<DoctorsPageContextValue | null>(null);

export function DoctorsPageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DoctorsUiState>(createInitialDoctorsUiState);

  const value = useMemo<DoctorsPageContextValue>(
    () => ({
      ...state,
      openCreateModal: () =>
        setState({
          modalOpen: true,
          editingDoctor: null
        }),
      openEditModal: (doctor: Doctor) =>
        setState({
          modalOpen: true,
          editingDoctor: doctor
        }),
      closeModal: () => setState(createInitialDoctorsUiState())
    }),
    [state]
  );

  return <DoctorsPageContext.Provider value={value}>{children}</DoctorsPageContext.Provider>;
}

export function useDoctorsPageContext() {
  const context = useContext(DoctorsPageContext);
  if (!context) {
    throw new Error("useDoctorsPageContext must be used within DoctorsPageProvider");
  }

  return context;
}
