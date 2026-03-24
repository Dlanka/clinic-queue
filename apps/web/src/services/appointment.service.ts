import { http } from "./http";

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface UpdateAppointmentPayload {
  patientId?: string;
  doctorId?: string;
  scheduledAt?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export class AppointmentService {
  static async list(status?: AppointmentStatus | "ALL") {
    const query =
      status && status !== "ALL" ? { params: { status } } : undefined;
    const { data } = await http.get<{ appointments: Appointment[] }>("/appointments", query);
    return data.appointments;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ appointment: Appointment }>(`/appointments/${id}`);
    return data.appointment;
  }

  static async create(payload: CreateAppointmentPayload) {
    const { data } = await http.post<{ appointment: Appointment }>("/appointments", payload);
    return data.appointment;
  }

  static async update(id: string, payload: UpdateAppointmentPayload) {
    const { data } = await http.patch<{ appointment: Appointment }>(`/appointments/${id}`, payload);
    return data.appointment;
  }

  static async remove(id: string) {
    await http.delete(`/appointments/${id}`);
  }
}
