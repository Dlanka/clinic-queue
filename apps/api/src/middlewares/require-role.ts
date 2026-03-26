import type { RequestHandler } from "express";
import { SettingsService } from "../services/settings.service";
import { HttpError } from "../utils/http-error";

export function requireRole(...allowedRoles: string[]): RequestHandler {
  return async (req, _res, next) => {
    try {
      const auth = req.auth;

      if (!auth) {
        return next(new HttpError(401, "Unauthenticated"));
      }

      const settings = await SettingsService.getByTenantId(auth.tenantId);
      if (!settings?.access?.enforceRoleMatrix) {
        return next();
      }

      const permitted = auth.roles.some((role: string) => allowedRoles.includes(role));

      if (!permitted) {
        return next(new HttpError(403, "Insufficient role"));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
