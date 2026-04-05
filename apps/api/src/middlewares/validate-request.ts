import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { HttpError } from "../utils/http-error";

export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid request body"));
    }

    req.body = parsed.data;
    return next();
  };
}

export function validateParams(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid request params"));
    }

    req.params = parsed.data as never;
    return next();
  };
}

export function validateQuery(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      return next(new HttpError(400, parsed.error.issues[0]?.message ?? "Invalid request query"));
    }

    req.query = parsed.data as never;
    return next();
  };
}
