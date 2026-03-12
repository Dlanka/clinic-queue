import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Medicine } from "@/services/medicine.service";
import {
  createInitialMedicinesUiState,
  type MedicinesUiState
} from "../store/medicines.store";

type MedicinesPageContextValue = MedicinesUiState & {
  openCreateModal: () => void;
  openEditModal: (medicine: Medicine) => void;
  closeModal: () => void;
};

const MedicinesPageContext = createContext<MedicinesPageContextValue | null>(null);

export function MedicinesPageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MedicinesUiState>(createInitialMedicinesUiState);

  const value = useMemo<MedicinesPageContextValue>(
    () => ({
      ...state,
      openCreateModal: () =>
        setState({
          modalOpen: true,
          editingMedicine: null
        }),
      openEditModal: (medicine: Medicine) =>
        setState({
          modalOpen: true,
          editingMedicine: medicine
        }),
      closeModal: () => setState(createInitialMedicinesUiState())
    }),
    [state]
  );

  return <MedicinesPageContext.Provider value={value}>{children}</MedicinesPageContext.Provider>;
}

export function useMedicinesPageContext() {
  const context = useContext(MedicinesPageContext);
  if (!context) {
    throw new Error("useMedicinesPageContext must be used within MedicinesPageProvider");
  }

  return context;
}
