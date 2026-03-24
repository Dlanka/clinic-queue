import { Router } from "express";
import { z } from "zod";
import { PrescriptionController } from "../controllers/prescription.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const visitIdParamsSchema = z.object({
  visitId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid visit id")
});

const prescriptionIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid prescription id")
});

const createPrescriptionSchema = z.object({
  items: z
    .array(
      z.object({
        medicineId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid medicine id"),
        quantity: z.number().int().positive(),
        dosage: z.string().trim().max(80).optional(),
        frequency: z.string().trim().max(80).optional(),
        duration: z.string().trim().max(80).optional(),
        instructions: z.string().trim().max(400).optional()
      })
    )
    .min(1, "At least one medicine is required")
});

const updatePrescriptionSchema = createPrescriptionSchema;

const prescriptionRouter = Router();

prescriptionRouter.use(requireAuth);

prescriptionRouter.get(
  "/prescriptions",
  requireRole("ADMIN", "PHARMACY_STAFF", "DOCTOR", "NURSE", "RECEPTION"),
  PrescriptionController.list
);

prescriptionRouter.post(
  "/visits/:visitId/prescriptions",
  requireRole("ADMIN", "DOCTOR"),
  validateParams(visitIdParamsSchema),
  validateBody(createPrescriptionSchema),
  PrescriptionController.createForVisit
);

prescriptionRouter.get(
  "/prescriptions/:id",
  requireRole("ADMIN", "PHARMACY_STAFF", "DOCTOR", "NURSE", "RECEPTION"),
  validateParams(prescriptionIdParamsSchema),
  PrescriptionController.getById
);

prescriptionRouter.patch(
  "/prescriptions/:id",
  requireRole("ADMIN", "DOCTOR"),
  validateParams(prescriptionIdParamsSchema),
  validateBody(updatePrescriptionSchema),
  PrescriptionController.update
);

prescriptionRouter.patch(
  "/prescriptions/:id/dispense",
  requireRole("ADMIN", "PHARMACY_STAFF"),
  validateParams(prescriptionIdParamsSchema),
  PrescriptionController.dispense
);

export { prescriptionRouter };
