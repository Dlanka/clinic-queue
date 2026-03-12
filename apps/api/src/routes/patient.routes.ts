import { Router } from "express";
import { z } from "zod";
import { PatientController } from "../controllers/patient.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const patientIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id")
});

const createPatientSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  phone: z.string().trim().max(30).optional(),
  email: z.string().email().optional(),
  address: z.string().trim().max(255).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

const updatePatientSchema = z
  .object({
    firstName: z.string().trim().min(2).max(80).optional(),
    lastName: z.string().trim().min(2).max(80).optional(),
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    phone: z.string().trim().max(30).optional(),
    email: z.string().email().optional(),
    address: z.string().trim().max(255).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update"
  });

const patientRouter = Router();

patientRouter.use(requireAuth);

patientRouter.get("/", requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"), PatientController.list);
patientRouter.post(
  "/",
  requireRole("ADMIN", "RECEPTION", "NURSE"),
  validateBody(createPatientSchema),
  PatientController.create
);
patientRouter.get(
  "/:id",
  requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"),
  validateParams(patientIdParamsSchema),
  PatientController.getById
);
patientRouter.patch(
  "/:id",
  requireRole("ADMIN", "RECEPTION", "NURSE"),
  validateParams(patientIdParamsSchema),
  validateBody(updatePatientSchema),
  PatientController.update
);
patientRouter.delete(
  "/:id",
  requireRole("ADMIN", "RECEPTION", "NURSE"),
  validateParams(patientIdParamsSchema),
  PatientController.remove
);

export { patientRouter };
