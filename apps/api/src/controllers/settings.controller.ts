import type { RequestHandler } from "express";
import { SettingsService } from "../services/settings.service";
import { HttpError } from "../utils/http-error";

export const SettingsController = {
  get: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const settings = await SettingsService.getByTenantId(req.auth.tenantId);
      return res.status(200).json({ settings });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  update: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const settings = await SettingsService.updateByTenantId(req.auth.tenantId, req.body);
      return res.status(200).json({ settings });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};

