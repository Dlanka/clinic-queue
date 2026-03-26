import { http } from "./http";

export type PrescriptionStatus = "PRESCRIBED" | "DISPENSED";

export interface PrescriptionItemInput {
  medicineId: string;
  quantity: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  dispensedQty: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  visitId: string;
  queueEntryId?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  prescribedByMemberId: string;
  dispensedByMemberId?: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  dispensedAt?: string;
  createdAt: string;
}

export class PrescriptionService {
  static async list(status?: PrescriptionStatus, visitId?: string) {
    const { data } = await http.get<{ prescriptions: Prescription[] }>("/prescriptions", {
      params: {
        ...(status ? { status } : {}),
        ...(visitId ? { visitId } : {})
      }
    });
    return data.prescriptions;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ prescription: Prescription }>(`/prescriptions/${id}`);
    return data.prescription;
  }

  static async createForVisit(visitId: string, items: PrescriptionItemInput[]) {
    const { data } = await http.post<{ prescription: Prescription }>(`/visits/${visitId}/prescriptions`, {
      items
    });
    return data.prescription;
  }

  static async update(id: string, items: PrescriptionItemInput[]) {
    const { data } = await http.patch<{ prescription: Prescription }>(`/prescriptions/${id}`, {
      items
    });
    return data.prescription;
  }

  static async dispense(id: string) {
    const { data } = await http.patch<{ prescription: Prescription }>(`/prescriptions/${id}/dispense`);
    return data.prescription;
  }

  static async print(id: string, paperWidthMm: 58 | 80 = 80) {
    const { data } = await http.get<Blob>(`/prescriptions/${id}/print`, {
      responseType: "blob",
      params: { paperWidthMm }
    });
    return data;
  }
}
