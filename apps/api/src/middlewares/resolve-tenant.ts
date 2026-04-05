import type { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { TenantModel } from "../models/tenant.model";
import { HttpError } from "../utils/http-error";

const TENANT_OPTIONAL_PATHS = new Set([
  "/health",
  "/auth/login",
  "/auth/select-tenant",
  "/auth/refresh",
  "/auth/logout",
  "/auth/me"
]);

export const resolveTenant: RequestHandler = async (req, _res, next) => {
  if (req.path.startsWith("/admin")) {
    return next();
  }

  if (TENANT_OPTIONAL_PATHS.has(req.path)) {
    return next();
  }

  const tenantIdHeader = req.header("x-tenant-id");
  const tenantId = tenantIdHeader;

  if (!tenantId) {
    return next(new HttpError(400, "Missing x-tenant-id header"));
  }

  if (!isValidObjectId(tenantId)) {
    return next(new HttpError(400, "Invalid tenant id"));
  }

  const tenant = await TenantModel.findById(tenantId).lean();

  if (!tenant) {
    return next(new HttpError(404, "Tenant not found"));
  }

  req.tenantId = tenantId;
  return next();
};
