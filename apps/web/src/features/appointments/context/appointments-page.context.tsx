import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import type { Appointment } from "@/services/appointment.service";
import {
  createInitialAppointmentsUiState,
  type AppointmentsUiState
} from "../store/appointments.store";

type AppointmentsPageContextValue = AppointmentsUiState & {
  openCreateModal: () => void;
  openEditModal: (appointment: Appointment) => void;
  closeModal: () => void;
};

const AppointmentsPageContext = createContext<AppointmentsPageContextValue | null>(null);

export function AppointmentsPageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppointmentsUiState>(createInitialAppointmentsUiState);

  const value = useMemo<AppointmentsPageContextValue>(
    () => ({
      ...state,
      openCreateModal: () =>
        setState({
          modalOpen: true,
          editingAppointmentId: null
        }),
      openEditModal: (appointment: Appointment) =>
        setState({
          modalOpen: true,
          editingAppointmentId: appointment.id
        }),
      closeModal: () => setState(createInitialAppointmentsUiState())
    }),
    [state]
  );

  return <AppointmentsPageContext.Provider value={value}>{children}</AppointmentsPageContext.Provider>;
}

export function useAppointmentsPageContext() {
  const context = useContext(AppointmentsPageContext);
  if (!context) {
    throw new Error("useAppointmentsPageContext must be used within AppointmentsPageProvider");
  }

  return context;
}
