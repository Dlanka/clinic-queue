import type { RequestHandler } from "express";
import { ACCESS_COOKIE_NAME } from "../constants/auth";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "../utils/http-error";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies[ACCESS_COOKIE_NAME] as string | undefined;

  if (!token) {
    return next(new HttpError(401, "Unauthenticated"));
  }

  try {
    const payload = verifyAccessToken(token);
    const tenantId = req.tenantId;

    if (!tenantId || payload.tenantId !== tenantId) {
      return next(new HttpError(403, "Tenant mismatch"));
    }

    const [account, membership] = await Promise.all([
      AccountModel.findOne({ _id: payload.accountId, isActive: true }).lean(),
      TenantMemberModel.findOne({
        tenantId,
        accountId: payload.accountId,
        isActive: true
      }).lean()
    ]);

    if (!account || !membership) {
      return next(new HttpError(401, "Authentication invalid"));
    }

    req.auth = {
      accountId: payload.accountId,
      tenantId,
      roles: membership.roles
    };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid access token"));
  }
};
