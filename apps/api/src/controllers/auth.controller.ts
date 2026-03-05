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
  res.cookie(ACCESS_COOKIE_NAME, accessToken, accessCookieOptions);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  res.cookie(CSRF_COOKIE_NAME, generateCsrfToken(), csrfCookieOptions);
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

      writeSessionCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return res.status(200).json({ mode: "LOGGED_IN" });
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

      writeSessionCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
      return res.status(200).json({ mode: "LOGGED_IN" });
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
      writeSessionCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

      return res.status(200).json({ ok: true });
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler,

  logout: (async (_req, res, next) => {
    try {
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
      return res.status(200).json(session);
    } catch (error) {
      return next(error);
    }
  }) as RequestHandler
};
