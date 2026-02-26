import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env";
import type { AuthContext, TokenPayload } from "../types/auth";

function normalizePayload(payload: TokenPayload): AuthContext {
  return {
    accountId: payload.accountId,
    tenantId: payload.tenantId,
    roles: payload.roles
  };
}

export function signAccessToken(auth: AuthContext) {
  return jwt.sign(
    {
      sub: auth.accountId,
      accountId: auth.accountId,
      tenantId: auth.tenantId,
      roles: auth.roles
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_TTL as StringValue }
  );
}

export function signRefreshToken(auth: AuthContext) {
  return jwt.sign(
    {
      sub: auth.accountId,
      accountId: auth.accountId,
      tenantId: auth.tenantId,
      roles: auth.roles
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_TTL as StringValue }
  );
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  return normalizePayload(payload);
}

export function verifyRefreshToken(token: string) {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  return normalizePayload(payload);
}
