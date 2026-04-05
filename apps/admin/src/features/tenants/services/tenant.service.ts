import { http } from "@/services/http";
import type { TenantItem } from "../types";

export type CreateTenantInput = {
  name: string;
  adminEmail: string;
  adminName?: string;
  adminPassword: string;
  adminRoles?: string[];
};

export async function listTenants(search?: string, status?: "ACTIVE" | "INACTIVE") {
  const { data } = await http.get<{ tenants: TenantItem[] }>("/admin/tenants", {
    params: {
      search: search || undefined,
      status: status || undefined
    }
  });

  return data.tenants;
}

export async function createTenant(input: CreateTenantInput) {
  const { data } = await http.post<{ tenant: TenantItem }>("/admin/tenants", input);
  return data.tenant;
}

export async function updateTenantStatus(tenantId: string, status: "ACTIVE" | "INACTIVE") {
  const endpoint =
    status === "ACTIVE"
      ? `/admin/tenants/${tenantId}/activate`
      : `/admin/tenants/${tenantId}/deactivate`;

  const { data } = await http.post<{ tenant: TenantItem }>(endpoint);
  return data.tenant;
}
