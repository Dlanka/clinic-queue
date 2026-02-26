import type { RequestHandler } from "express";
import { HttpError } from "../utils/http-error";

export function requireRole(...allowedRoles: string[]): RequestHandler {
  return (req, _res, next) => {
    const auth = req.auth;

    if (!auth) {
      return next(new HttpError(401, "Unauthenticated"));
    }

    const permitted = auth.roles.some((role: string) => allowedRoles.includes(role));

    if (!permitted) {
      return next(new HttpError(403, "Insufficient role"));
    }

    return next();
  };
}
