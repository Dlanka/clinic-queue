import { http } from "./http";

export type QueueStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface QueueEntry {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  queueDate: string;
  queueNumber: number;
  status: QueueStatus;
  isPriority?: boolean;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface CreateQueueEntryPayload {
  patientId: string;
  doctorId: string;
  queuedAt?: string;
  isPriority?: boolean;
  notes?: string;
}

export interface QueueListFilters {
  date?: string;
  doctorId?: string;
  allDates?: boolean;
}

export class QueueService {
  static async list(status?: QueueStatus | "ALL", filters?: QueueListFilters) {
    const params: Record<string, string> = {};

    if (status && status !== "ALL") {
      params.status = status;
    }

    if (filters?.date) {
      params.date = filters.date;
    }

    if (filters?.doctorId) {
      params.doctorId = filters.doctorId;
    }

    if (filters?.allDates) {
      params.allDates = "1";
    }

    const query = Object.keys(params).length > 0 ? { params } : undefined;
    const { data } = await http.get<{ entries: QueueEntry[] }>("/queue", query);
    return data.entries;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ entry: QueueEntry }>(`/queue/${id}`);
    return data.entry;
  }

  static async create(payload: CreateQueueEntryPayload) {
    const { data } = await http.post<{ entry: QueueEntry }>("/queue", payload);
    return data.entry;
  }

  static async start(id: string) {
    const { data } = await http.patch<{ entry: QueueEntry }>(`/queue/${id}/start`);
    return data.entry;
  }

  static async complete(id: string) {
    const { data } = await http.patch<{ entry: QueueEntry }>(`/queue/${id}/complete`);
    return data.entry;
  }

  static async cancel(id: string) {
    const { data } = await http.patch<{ entry: QueueEntry }>(`/queue/${id}/cancel`);
    return data.entry;
  }
}
