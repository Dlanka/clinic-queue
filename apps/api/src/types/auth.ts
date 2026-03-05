export interface AuthContext {
  accountId: string;
  memberId: string;
  tenantId: string;
  roles: string[];
}

export interface TokenPayload extends AuthContext {
  sub: string;
}

export interface LoginSelectionPayload {
  accountId: string;
  allowedTenantIds: string[];
}
