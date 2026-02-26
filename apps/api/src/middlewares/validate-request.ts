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
