import { http } from "./http";

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  queueEntryId?: string;
  doctorName: string;
  createdByMemberId: string;
  visitedAt: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
  createdAt: string;
}

export interface CreateVisitPayload {
  doctorId: string;
  queueEntryId?: string;
  visitedAt?: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
}

export interface UpdateVisitPayload {
  visitedAt?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
}

export class VisitService {
  static async listByPatient(patientId: string) {
    const { data } = await http.get<{ visits: Visit[] }>(`/patients/${patientId}/visits`);
    return data.visits;
  }

  static async create(patientId: string, payload: CreateVisitPayload) {
    const { data } = await http.post<{ visit: Visit }>(`/patients/${patientId}/visits`, payload);
    return data.visit;
  }

  static async update(patientId: string, visitId: string, payload: UpdateVisitPayload) {
    const { data } = await http.patch<{ visit: Visit }>(
      `/patients/${patientId}/visits/${visitId}`,
      payload
    );
    return data.visit;
  }

  static async getByQueueEntry(queueEntryId: string) {
    const { data } = await http.get<{ visit: Visit | null }>(`/queue/${queueEntryId}/visit`);
    return data.visit;
  }
}
