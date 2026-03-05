import type { RequestHandler } from "express";
import { ACCESS_COOKIE_NAME } from "../constants/auth";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel } from "../models/tenant.model";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "../utils/http-error";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token = req.cookies[ACCESS_COOKIE_NAME] as string | undefined;

  if (!token) {
    return next(new HttpError(401, "Unauthenticated"));
  }

  try {
    const payload = verifyAccessToken(token);

    const [account, membership, tenant] = await Promise.all([
      AccountModel.findOne({ _id: payload.accountId, status: "ACTIVE" }).lean(),
      TenantMemberModel.findOne({
        _id: payload.memberId,
        tenantId: payload.tenantId,
        accountId: payload.accountId,
        status: "ACTIVE"
      }).lean(),
      TenantModel.findOne({ _id: payload.tenantId, status: "ACTIVE" }).lean()
    ]);

    if (!account || !membership || !tenant) {
      return next(new HttpError(401, "Authentication invalid"));
    }

    req.auth = {
      accountId: payload.accountId,
      memberId: payload.memberId,
      tenantId: payload.tenantId,
      roles: membership.roles
    };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid access token"));
  }
};
