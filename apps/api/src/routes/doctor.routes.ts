import { Router } from "express";
import { z } from "zod";
import { DoctorController } from "../controllers/doctor.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const doctorIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid doctor id")
});

const createDoctorSchema = z.object({
  memberId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid member id"),
  name: z.string().trim().min(2).max(120),
  specialization: z.string().trim().min(2).max(120),
  licenseNumber: z.string().trim().max(80).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional()
});

const updateDoctorSchema = z
  .object({
    memberId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid member id").optional(),
    name: z.string().trim().min(2).max(120).optional(),
    specialization: z.string().trim().min(2).max(120).optional(),
    licenseNumber: z.string().trim().max(80).optional(),
    status: z.enum(["ACTIVE", "DISABLED"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update"
  });

const doctorRouter = Router();

doctorRouter.use(requireAuth, requireRole("ADMIN"));

doctorRouter.get("/", DoctorController.list);
doctorRouter.post("/", validateBody(createDoctorSchema), DoctorController.create);
doctorRouter.get("/:id", validateParams(doctorIdParamsSchema), DoctorController.getById);
doctorRouter.patch(
  "/:id",
  validateParams(doctorIdParamsSchema),
  validateBody(updateDoctorSchema),
  DoctorController.update
);
doctorRouter.delete("/:id", validateParams(doctorIdParamsSchema), DoctorController.remove);

export { doctorRouter };
