import { http } from "./http";

export type MedicineStatus = "ACTIVE" | "INACTIVE";

export interface Medicine {
  id: string;
  name: string;
  category?: string;
  unit?: string;
  stockQty: number;
  reorderLevel: number;
  price?: number;
  status: MedicineStatus;
  isLowStock: boolean;
  createdAt: string;
}

export interface MedicineCategoryOption {
  value: string;
  label: string;
}

export interface CreateMedicinePayload {
  name: string;
  category?: string;
  unit?: string;
  stockQty: number;
  reorderLevel: number;
  price?: number;
  status?: MedicineStatus;
}

export interface UpdateMedicinePayload {
  name?: string;
  category?: string;
  unit?: string;
  stockQty?: number;
  reorderLevel?: number;
  price?: number;
  status?: MedicineStatus;
}

export class MedicineService {
  static async listCategories() {
    const { data } = await http.get<{ categories: MedicineCategoryOption[] }>("/medicines/categories");
    return data.categories;
  }

  static async listUnits() {
    const { data } = await http.get<{ units: MedicineCategoryOption[] }>("/medicines/units");
    return data.units;
  }

  static async list() {
    const { data } = await http.get<{ medicines: Medicine[] }>("/medicines");
    return data.medicines;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ medicine: Medicine }>(`/medicines/${id}`);
    return data.medicine;
  }

  static async create(payload: CreateMedicinePayload) {
    const { data } = await http.post<{ medicine: Medicine }>("/medicines", payload);
    return data.medicine;
  }

  static async update(id: string, payload: UpdateMedicinePayload) {
    const { data } = await http.patch<{ medicine: Medicine }>(`/medicines/${id}`, payload);
    return data.medicine;
  }

  static async remove(id: string) {
    await http.delete(`/medicines/${id}`);
  }
}
