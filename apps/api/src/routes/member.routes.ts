import { Router } from "express";
import { z } from "zod";
import { APP_ROLES } from "../constants/roles";
import { MemberController } from "../controllers/member.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const memberIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid member id")
});

const createMemberSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(2).max(80).optional(),
  roles: z.array(z.enum(APP_ROLES)).min(1, "Select at least one role"),
  isActive: z.boolean().optional()
});

const updateMemberSchema = z
  .object({
    roles: z.array(z.enum(APP_ROLES)).min(1, "Select at least one role").optional(),
    isActive: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update"
  });

const memberRouter = Router();

memberRouter.use(requireAuth, requireRole("ADMIN"));

memberRouter.get("/", MemberController.list);
memberRouter.post("/", validateBody(createMemberSchema), MemberController.create);
memberRouter.get("/:id", validateParams(memberIdParamsSchema), MemberController.getById);
memberRouter.patch(
  "/:id",
  validateParams(memberIdParamsSchema),
  validateBody(updateMemberSchema),
  MemberController.update
);
memberRouter.delete("/:id", validateParams(memberIdParamsSchema), MemberController.remove);

export { memberRouter };
