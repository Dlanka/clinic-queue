import type { RequestHandler } from "express";
import { HttpError } from "../utils/http-error";

export const requireSuperAdmin: RequestHandler = (req, _res, next) => {
  if (!req.auth) {
    return next(new HttpError(401, "Unauthenticated"));
  }

  if (!req.auth.isSuperAdmin) {
    return next(new HttpError(403, "Super admin access required"));
  }

  return next();
};
