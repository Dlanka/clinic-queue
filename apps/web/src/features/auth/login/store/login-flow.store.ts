import type { TenantChoice } from "@/services/auth.service";

export type LoginFlowState = {
  loginToken: string;
  tenants: TenantChoice[];
  selectedTenantId: string;
};

export const createInitialLoginFlowState = (): LoginFlowState => ({
  loginToken: "",
  tenants: [],
  selectedTenantId: ""
});

export const createTenantSelectionState = (
  loginToken: string,
  tenants: TenantChoice[]
): LoginFlowState => ({
  loginToken,
  tenants,
  selectedTenantId: tenants[0]?.tenantId ?? ""
});
