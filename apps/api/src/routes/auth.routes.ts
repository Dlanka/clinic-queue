import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/require-auth";
import { validateBody } from "../middlewares/validate-request";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const selectTenantSchema = z.object({
  loginToken: z.string().min(1),
  tenantId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid tenant id")
});

const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), AuthController.login);
authRouter.post("/select-tenant", validateBody(selectTenantSchema), AuthController.selectTenant);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", requireAuth, AuthController.logout);
authRouter.get("/me", requireAuth, AuthController.me);

export { authRouter };
