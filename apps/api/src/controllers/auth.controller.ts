import type { CookieOptions, RequestHandler } from "express";
import { ACCESS_COOKIE_NAME, CSRF_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../constants/auth";
import { env, isProduction } from "../config/env";
import { AuthService } from "../services/auth.service";
import { HttpError } from "../utils/http-error";
import { generateCsrfToken } from "../utils/crypto";

const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  maxAge: 15 * 60 * 1000
};

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const csrfCookieOptions: CookieOptions = {
  httpOnly: false,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

function writeAuthCookies(res: Parameters<RequestHandler>[1], accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  res.cookie(CSRF_COOKIE_NAME, generateCsrfToken(), csrfCookieOptions);
}

function clearAuthCookies(res: Parameters<RequestHandler>[1]) {
  const clearOptions: CookieOptions = { path: "/" };
  res.clearCookie(ACCESS_COOKIE_NAME, clearOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, clearOptions);
  res.clearCookie(CSRF_COOKIE_NAME, clearOptions);
}

export const AuthController = {
  login: (async (req, res, next) => {
    try {
      if (!req.tenantId) {
        throw new HttpError(400, "Missing tenant");
      }

      const result = await AuthService.login({
        tenantId: req.tenantId,
        email: req.body.email,
        password: req.body.password
      });

      writeAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

      return res.status(200).json({
        user: result.user,
        tokenType: "cookie"
      });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  refresh: (async (req, res, next) => {
    try {
      if (!req.tenantId) {
        throw new HttpError(400, "Missing tenant");
      }

      const refreshToken = req.cookies[REFRESH_COOKIE_NAME] as string | undefined;
      if (!refreshToken) {
        throw new HttpError(401, "Refresh token missing");
      }

      const result = await AuthService.refresh(req.tenantId, refreshToken);
      writeAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

      return res.status(200).json({
        user: result.user
      });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  logout: (async (_req, res, next) => {
    try {
      clearAuthCookies(res);
      return res.status(200).json({ message: "Logged out" });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  me: (async (req, res, next) => {
    try {
      if (!req.auth) {
        throw new HttpError(401, "Unauthenticated");
      }

      const user = await AuthService.me(req.auth);
      return res.status(200).json({ user, env: env.NODE_ENV });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
