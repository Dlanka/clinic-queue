import type { AppointmentStatus } from "@/services/appointment.service";

export interface AppointmentsUiState {
  modalOpen: boolean;
  editingAppointmentId: string | null;
}

export function createInitialAppointmentsUiState(): AppointmentsUiState {
  return {
    modalOpen: false,
    editingAppointmentId: null
  };
}

export const doctorsQueryKey = ["doctors"] as const;
export const patientsQueryKey = ["patients"] as const;
export const appointmentsQueryKey = (status: "ALL" | AppointmentStatus) =>
  ["appointments", status] as const;
