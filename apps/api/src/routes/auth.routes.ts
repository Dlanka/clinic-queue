import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/require-auth";
import { validateBody, validateParams } from "../middlewares/validate-request";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const selectTenantSchema = z.object({
  loginToken: z.string().min(1),
  tenantId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid tenant id")
});

const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(120)
});

const updatePreferencesSchema = z.object({
  language: z.string().trim().min(2).max(10),
  timezone: z.string().trim().min(1).max(120),
  dateFormat: z.string().trim().min(1).max(64),
  timeFormat: z.string().trim().min(1).max(64),
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean()
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(1).max(128),
    confirmPassword: z.string().min(1).max(128)
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

const sessionIdParamSchema = z.object({
  sessionId: z.string().trim().min(1)
});

const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), AuthController.login);
authRouter.post("/select-tenant", validateBody(selectTenantSchema), AuthController.selectTenant);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", requireAuth, AuthController.logout);
authRouter.get("/me", requireAuth, AuthController.me);
authRouter.patch("/me", requireAuth, validateBody(updateMeSchema), AuthController.updateMe);
authRouter.patch(
  "/preferences",
  requireAuth,
  validateBody(updatePreferencesSchema),
  AuthController.updatePreferences
);
authRouter.get("/sessions", requireAuth, AuthController.sessions);
authRouter.delete(
  "/sessions/:sessionId",
  requireAuth,
  validateParams(sessionIdParamSchema),
  AuthController.revokeSession
);
authRouter.post("/sessions/revoke-others", requireAuth, AuthController.revokeOtherSessions);
authRouter.post(
  "/change-password",
  requireAuth,
  validateBody(changePasswordSchema),
  AuthController.changePassword
);

export { authRouter };
