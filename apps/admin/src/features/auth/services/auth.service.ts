import { http } from "@/services/http";
import type { AuthMeResponse, LoginResponse } from "../types";

export async function login(email: string, password: string) {
  const { data } = await http.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

export async function selectTenant(loginToken: string, tenantId: string) {
  await http.post("/auth/select-tenant", { loginToken, tenantId });
}

export async function fetchMe() {
  const { data } = await http.get<AuthMeResponse>("/auth/me");
  return data;
}

export async function logout() {
  await http.post("/auth/logout");
}
