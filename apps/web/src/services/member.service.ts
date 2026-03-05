import { http } from "./http";
import type { AppRole } from "@/config/roles";

export interface Member {
  id: string;
  accountId: string;
  email: string;
  name: string;
  roles: AppRole[];
  status: "ACTIVE" | "INVITED" | "DISABLED";
}

export interface CreateMemberPayload {
  email: string;
  name?: string;
  roles: AppRole[];
  isActive?: boolean;
}

export interface UpdateMemberPayload {
  roles?: AppRole[];
  isActive?: boolean;
}

export class MemberService {
  static async list() {
    const { data } = await http.get<{ members: Member[] }>("/members");
    return data.members;
  }

  static async getById(id: string) {
    const { data } = await http.get<{ member: Member }>(`/members/${id}`);
    return data.member;
  }

  static async create(payload: CreateMemberPayload) {
    const { data } = await http.post<{ member: Member }>("/members", payload);
    return data.member;
  }

  static async update(id: string, payload: UpdateMemberPayload) {
    const { data } = await http.patch<{ member: Member }>(`/members/${id}`, payload);
    return data.member;
  }

  static async remove(id: string) {
    await http.delete(`/members/${id}`);
  }
}
