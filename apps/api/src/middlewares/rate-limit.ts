import type { RequestHandler } from "express";
import { env } from "../config/env";

interface RateLimitState {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateLimitState>();

const windowMs = env.RATE_LIMIT_WINDOW_MS;
const maxRequests = env.RATE_LIMIT_MAX;

function getClientIp(requestIp?: string) {
  if (!requestIp) {
    return "unknown";
  }

  return requestIp;
}

export const rateLimit: RequestHandler = (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  const now = Date.now();
  const key = `${getClientIp(req.ip)}:${Math.floor(now / windowMs)}`;
  const current = buckets.get(key);

  if (!current) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  if (now - current.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  current.count += 1;
  if (current.count > maxRequests) {
    res.setHeader("Retry-After", String(Math.ceil((windowMs - (now - current.windowStart)) / 1000)));
    return res.status(429).json({ message: "Too many requests" });
  }

  return next();
};
