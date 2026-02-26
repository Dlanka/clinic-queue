export interface AuthContext {
  accountId: string;
  tenantId: string;
  roles: string[];
}

export interface TokenPayload extends AuthContext {
  sub: string;
}
