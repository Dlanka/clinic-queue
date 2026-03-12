import { http } from "./http";

export interface Doctor {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  name: string;
  specialization: string;
  licenseNumber?: string;
  status: "ACTIVE" | "DISABLED";
}

export interface CreateDoctorPayload {
  memberId: string;
  name: string;
  specialization: string;
  licenseNumber?: string;
  status?: "ACTIVE" | "DISABLED";
}

export interface UpdateDoctorPayload {
  memberId?: string;
  name?: string;
  specialization?: string;
  licenseNumber?: string;
  status?: "ACTIVE" | "DISABLED";
}

export class DoctorService {
  static async list() {
    const { data } = await http.get<{ doctors: Doctor[] }>("/doctors");
    return data.doctors;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ doctor: Doctor }>(`/doctors/${id}`);
    return data.doctor;
  }

  static async create(payload: CreateDoctorPayload) {
    const { data } = await http.post<{ doctor: Doctor }>("/doctors", payload);
    return data.doctor;
  }

  static async update(id: string, payload: UpdateDoctorPayload) {
    const { data } = await http.patch<{ doctor: Doctor }>(`/doctors/${id}`, payload);
    return data.doctor;
  }

  static async remove(id: string) {
    await http.delete(`/doctors/${id}`);
  }
}
