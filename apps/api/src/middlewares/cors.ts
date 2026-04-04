import type { RequestHandler } from "express";
import { corsOrigins } from "../config/env";

function isAllowedOrigin(origin: string) {
  return corsOrigins.includes(origin);
}

export const cors: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,x-tenant-id,x-csrf-token"
    );
    res.setHeader("Vary", "Origin");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return next();
};
