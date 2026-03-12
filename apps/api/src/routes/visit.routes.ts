import { Router } from "express";
import { z } from "zod";
import { VisitController } from "../controllers/visit.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const patientIdParamsSchema = z.object({
  patientId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id")
});

const createVisitSchema = z.object({
  doctorId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid doctor id"),
  visitedAt: z.string().datetime().optional(),
  symptoms: z.string().trim().min(2).max(1000),
  diagnosis: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional()
});

const visitRouter = Router();

visitRouter.use(requireAuth);

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

export { visitRouter };
