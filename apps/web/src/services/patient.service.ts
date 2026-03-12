import { http } from "./http";

export type PatientStatus = "ACTIVE" | "INACTIVE";
export type PatientGender = "MALE" | "FEMALE" | "OTHER";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status: PatientStatus;
  createdAt: string;
}

export interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status?: PatientStatus;
}

export interface UpdatePatientPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status?: PatientStatus;
}

export class PatientService {
  static async list() {
    const { data } = await http.get<{ patients: Patient[] }>("/patients");
    return data.patients;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ patient: Patient }>(`/patients/${id}`);
    return data.patient;
  }

  static async create(payload: CreatePatientPayload) {
    const { data } = await http.post<{ patient: Patient }>("/patients", payload);
    return data.patient;
  }

  static async update(id: string, payload: UpdatePatientPayload) {
    const { data } = await http.patch<{ patient: Patient }>(`/patients/${id}`, payload);
    return data.patient;
  }

  static async remove(id: string) {
    await http.delete(`/patients/${id}`);
  }
}
