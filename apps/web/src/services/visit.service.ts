import { http } from "./http";

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  createdByMemberId: string;
  visitedAt: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateVisitPayload {
  doctorId: string;
  visitedAt?: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
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
}
