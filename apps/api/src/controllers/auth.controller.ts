import type { CookieOptions, RequestHandler } from "express";
import { env, isProduction } from "../config/env";
import { ACCESS_COOKIE_NAME, CSRF_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../constants/auth";
import { AuthService } from "../services/auth.service";
import { HttpError } from "../utils/http-error";
import { generateCsrfToken } from "../utils/crypto";

const sameSite: CookieOptions["sameSite"] = env.COOKIE_SAME_SITE;

const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite,
  secure: isProduction || sameSite === "none",
  path: "/",
  maxAge: 15 * 60 * 1000
};

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite,
  secure: isProduction || sameSite === "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const csrfCookieOptions: CookieOptions = {
  httpOnly: false,
  sameSite,
  secure: isProduction || sameSite === "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

function writeSessionCookies(
  res: Parameters<RequestHandler>[1],
  accessToken: string,
  refreshToken: string
) {
  const csrfToken = generateCsrfToken();
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  res.cookie(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions);
  return csrfToken;
}

function ensureCsrfToken(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
  const existing = req.cookies[CSRF_COOKIE_NAME] as string | undefined;
  if (existing) {
    return existing;
  }

  const csrfToken = generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions);
  return csrfToken;
}

function clearSessionCookies(res: Parameters<RequestHandler>[1]) {
  const clearOptions: CookieOptions = { path: "/" };
  res.clearCookie(ACCESS_COOKIE_NAME, clearOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, clearOptions);
  res.clearCookie(CSRF_COOKIE_NAME, clearOptions);
}

export const AuthController = {
  login: (async (req, res, next) => {
    try {
      const result = await AuthService.login({
        email: req.body.email,
        password: req.body.password
      });

      if (result.mode === "SELECT_TENANT") {
        clearSessionCookies(res);
        return res.status(200).json({
          mode: "SELECT_TENANT",
          loginToken: result.loginToken,
          tenants: result.tenants
        });
      }

      const csrfToken = writeSessionCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return res.status(200).json({ mode: "LOGGED_IN", csrfToken });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  selectTenant: (async (req, res, next) => {
    try {
      const result = await AuthService.selectTenant({
        loginToken: req.body.loginToken,
        tenantId: req.body.tenantId
      });

      const csrfToken = writeSessionCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return res.status(200).json({ mode: "LOGGED_IN", csrfToken });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  refresh: (async (req, res, next) => {
    try {
      const refreshToken = req.cookies[REFRESH_COOKIE_NAME] as string | undefined;
      if (!refreshToken) {
        throw new HttpError(401, "Refresh token missing");
      }

      const result = await AuthService.refresh(refreshToken);
      const csrfToken = writeSessionCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

      return res.status(200).json({ ok: true, csrfToken });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  logout: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      await AuthService.logout(req.auth);
      clearSessionCookies(res);
      return res.status(200).json({ ok: true });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  me: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const session = await AuthService.me(req.auth);
      const csrfToken = ensureCsrfToken(req, res);
      return res.status(200).json({ ...session, csrfToken });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  updateMe: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await AuthService.updateProfile(req.auth, {
        name: req.body.name
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  updatePreferences: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await AuthService.updatePreferences(req.auth, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  sessions: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const sessions = await AuthService.listSessions(req.auth);
      return res.status(200).json({ sessions });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  revokeSession: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await AuthService.revokeSession(req.auth, String(req.params.sessionId));
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  revokeOtherSessions: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await AuthService.revokeOtherSessions(req.auth);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  changePassword: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const result = await AuthService.changePassword(req.auth, {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword
      });

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
