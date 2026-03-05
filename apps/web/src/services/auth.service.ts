import axios from "axios";
import { http } from "./http";

export interface TenantChoice {
  tenantId: string;
  tenantName: string;
}

export interface SessionMe {
  account: {
    id: string;
    email: string;
    name: string;
  };
  tenant: {
    id: string;
    name: string;
  };
  member: {
    id: string;
    roles: string[];
  };
}

export type LoginResponse =
  | { mode: "LOGGED_IN" }
  | {
      mode: "SELECT_TENANT";
      loginToken: string;
      tenants: TenantChoice[];
    };

export class AuthService {
  static async login(email: string, password: string) {
    const { data } = await http.post<LoginResponse>("/auth/login", { email, password });
    return data;
  }

  static async selectTenant(loginToken: string, tenantId: string) {
    const { data } = await http.post<{ mode: "LOGGED_IN" }>("/auth/select-tenant", {
      loginToken,
      tenantId
    });
    return data;
  }

  static async refresh() {
    const { data } = await http.post<{ ok: boolean }>("/auth/refresh");
    return data;
  }

  static async logout() {
    const { data } = await http.post<{ ok: boolean }>("/auth/logout");
    return data;
  }

  static async me() {
    try {
      const { data } = await http.get<SessionMe>("/auth/me");
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await this.refresh();
        const { data } = await http.get<SessionMe>("/auth/me");
        return data;
      }

      throw error;
    }
  }
}
