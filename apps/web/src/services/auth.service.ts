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
    preferences: {
      language: string;
      timezone: string;
      dateFormat: string;
      timeFormat: string;
      emailNotifications: boolean;
      inAppNotifications: boolean;
    };
    passwordChangedAt: string | null;
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

export interface UpdateProfilePayload {
  name: string;
}

export interface UpdatePreferencesPayload {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthSessionItem {
  sessionId: string;
  lastSeenAt: string;
  createdAt: string;
  isCurrent: boolean;
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

  static async updateProfile(payload: UpdateProfilePayload) {
    const { data } = await http.patch<{
      account: { id: string; email: string; name: string };
    }>("/auth/me", payload);
    return data;
  }

  static async changePassword(payload: ChangePasswordPayload) {
    const { data } = await http.post<{ ok: boolean }>("/auth/change-password", payload);
    return data;
  }

  static async updatePreferences(payload: UpdatePreferencesPayload) {
    const { data } = await http.patch<{
      preferences: UpdatePreferencesPayload;
    }>("/auth/preferences", payload);
    return data;
  }

  static async sessions() {
    const { data } = await http.get<{ sessions: AuthSessionItem[] }>("/auth/sessions");
    return data;
  }

  static async revokeSession(sessionId: string) {
    const { data } = await http.delete<{ ok: boolean }>(`/auth/sessions/${sessionId}`);
    return data;
  }

  static async revokeOtherSessions() {
    const { data } = await http.post<{ ok: boolean }>("/auth/sessions/revoke-others");
    return data;
  }
}
