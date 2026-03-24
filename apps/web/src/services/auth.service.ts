import { http, setTenantIdHeader } from "./http";

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
    setTenantIdHeader(tenantId);
    return data;
  }

  static async refresh() {
    const { data } = await http.post<{ ok: boolean }>("/auth/refresh");
    return data;
  }

  static async logout() {
    const { data } = await http.post<{ ok: boolean }>("/auth/logout");
    setTenantIdHeader(undefined);
    return data;
  }

  static async me() {
    const { data } = await http.get<SessionMe>("/auth/me");
    return data;
  }
}
