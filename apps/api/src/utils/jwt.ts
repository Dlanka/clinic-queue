import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env";
import type { AuthContext, LoginSelectionPayload, TokenPayload } from "../types/auth";

function normalizePayload(payload: TokenPayload): AuthContext {
  return {
    accountId: payload.accountId,
    memberId: payload.memberId,
    tenantId: payload.tenantId,
    roles: payload.roles,
    sessionId: payload.sessionId,
    refreshTokenId: payload.refreshTokenId,
    isSuperAdmin: payload.isSuperAdmin
  };
}

export function signAccessToken(auth: AuthContext) {
  return jwt.sign(
    {
      sub: auth.accountId,
      accountId: auth.accountId,
      memberId: auth.memberId,
      tenantId: auth.tenantId,
      roles: auth.roles,
      sessionId: auth.sessionId,
      refreshTokenId: auth.refreshTokenId,
      isSuperAdmin: auth.isSuperAdmin
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
      memberId: auth.memberId,
      tenantId: auth.tenantId,
      roles: auth.roles,
      sessionId: auth.sessionId,
      refreshTokenId: auth.refreshTokenId,
      isSuperAdmin: auth.isSuperAdmin
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

export function signLoginToken(payload: LoginSelectionPayload) {
  return jwt.sign(payload, env.JWT_LOGIN_SECRET, {
    expiresIn: env.JWT_LOGIN_TTL as StringValue
  });
}

export function verifyLoginToken(token: string) {
  return jwt.verify(token, env.JWT_LOGIN_SECRET) as LoginSelectionPayload;
}
