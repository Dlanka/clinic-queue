import type { RequestHandler } from "express";
import { CSRF_COOKIE_NAME } from "../constants/auth";
import { HttpError } from "../utils/http-error";

// Login/select-tenant/refresh happen before or during session bootstrap.
// They are exempted from double-submit checks intentionally.
const EXEMPT_PATHS = new Set(["/health", "/auth/login", "/auth/select-tenant", "/auth/refresh"]);
const PROTECTED_METHODS = new Set(["POST", "PATCH", "DELETE"]);

export const csrfGuard: RequestHandler = (req, _res, next) => {
  if (!PROTECTED_METHODS.has(req.method)) {
    return next();
  }

  if (EXEMPT_PATHS.has(req.path)) {
    return next();
  }

  const csrfCookie = req.cookies[CSRF_COOKIE_NAME] as string | undefined;
  const csrfHeader = req.header("x-csrf-token");

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return next(new HttpError(403, "CSRF token mismatch"));
  }

  return next();
};
