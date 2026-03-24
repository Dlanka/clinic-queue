import { Router } from "express";
import { z } from "zod";
import { VisitController } from "../controllers/visit.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const patientIdParamsSchema = z.object({
  patientId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id")
});

const visitParamsSchema = z.object({
  patientId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id"),
  visitId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid visit id")
});

const queueEntryParamsSchema = z.object({
  queueEntryId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid queue entry id")
});

const createVisitSchema = z.object({
  doctorId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid doctor id"),
  queueEntryId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid queue entry id").optional(),
  visitedAt: z.string().datetime().optional(),
  symptoms: z.string().trim().min(2).max(1000),
  diagnosis: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional(),
  bloodPressure: z.string().trim().max(32).optional(),
  pulse: z.number().positive().max(260).optional(),
  temperature: z.number().positive().max(60).optional(),
  weight: z.number().positive().max(500).optional()
});

const updateVisitSchema = z
  .object({
    visitedAt: z.string().datetime().optional(),
    symptoms: z.string().trim().min(2).max(1000).optional(),
    diagnosis: z.string().trim().max(1000).optional(),
    notes: z.string().trim().max(2000).optional(),
    bloodPressure: z.string().trim().max(32).optional(),
    pulse: z.number().positive().max(260).optional(),
    temperature: z.number().positive().max(60).optional(),
    weight: z.number().positive().max(500).optional()
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

const visitRouter = Router();

visitRouter.use(requireAuth);

visitRouter.get(
  "/queue/:queueEntryId/visit",
  requireRole("ADMIN", "DOCTOR", "NURSE"),
  validateParams(queueEntryParamsSchema),
  VisitController.getByQueueEntry
);

visitRouter.get(
  "/patients/:patientId/visits",
  requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"),
  validateParams(patientIdParamsSchema),
  VisitController.listByPatient
);

visitRouter.post(
  "/patients/:patientId/visits",
  requireRole("ADMIN", "DOCTOR", "NURSE"),
  validateParams(patientIdParamsSchema),
  validateBody(createVisitSchema),
  VisitController.create
);

visitRouter.patch(
  "/patients/:patientId/visits/:visitId",
  requireRole("ADMIN", "DOCTOR", "NURSE"),
  validateParams(visitParamsSchema),
  validateBody(updateVisitSchema),
  VisitController.update
);

export { visitRouter };
