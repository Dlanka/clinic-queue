import { Router } from "express";
import { z } from "zod";
import { AppointmentController } from "../controllers/appointment.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const appointmentIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid appointment id")
});

const appointmentStatusSchema = z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]);

const createAppointmentSchema = z.object({
  patientId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id"),
  doctorId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid doctor id"),
  scheduledAt: z.string().datetime(),
  status: appointmentStatusSchema.optional(),
  notes: z.string().trim().max(500).optional()
});

const updateAppointmentSchema = z
  .object({
    patientId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id").optional(),
    doctorId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid doctor id").optional(),
    scheduledAt: z.string().datetime().optional(),
    status: appointmentStatusSchema.optional(),
    notes: z.string().trim().max(500).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update"
  });

const appointmentRouter = Router();

appointmentRouter.use(requireAuth);

appointmentRouter.get(
  "/",
  requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"),
  AppointmentController.list
);
appointmentRouter.post(
  "/",
  requireRole("ADMIN", "RECEPTION"),
  validateBody(createAppointmentSchema),
  AppointmentController.create
);
appointmentRouter.get(
  "/:id",
  requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"),
  validateParams(appointmentIdParamsSchema),
  AppointmentController.getById
);
appointmentRouter.patch(
  "/:id",
  requireRole("ADMIN", "RECEPTION"),
  validateParams(appointmentIdParamsSchema),
  validateBody(updateAppointmentSchema),
  AppointmentController.update
);
appointmentRouter.delete(
  "/:id",
  requireRole("ADMIN", "RECEPTION"),
  validateParams(appointmentIdParamsSchema),
  AppointmentController.remove
);

export { appointmentRouter };
