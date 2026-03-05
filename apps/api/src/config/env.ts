import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017/clinic_queue_saas"),
  JWT_ACCESS_SECRET: z.string().min(16).default("dev_access_secret_change_me"),
  JWT_REFRESH_SECRET: z.string().min(16).default("dev_refresh_secret_change_me"),
  JWT_LOGIN_SECRET: z.string().min(16).default("dev_login_secret_change_me"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  JWT_LOGIN_TTL: z.string().default("5m"),
  COOKIE_SAME_SITE: z.enum(["lax", "none"]).default("lax")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
