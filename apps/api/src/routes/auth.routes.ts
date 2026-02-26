import { Router } from "express";
import { z } from "zod";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/require-auth";
import { validateBody } from "../middlewares/validate-request";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const authRouter = Router();

authRouter.post("/login", validateBody(loginSchema), AuthController.login);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", requireAuth, AuthController.logout);
authRouter.get("/me", requireAuth, AuthController.me);

export { authRouter };
