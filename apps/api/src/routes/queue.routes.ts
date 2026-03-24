import { Router } from "express";
import { z } from "zod";
import { QueueController } from "../controllers/queue.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const queueEntryIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid queue entry id")
});

const createQueueEntrySchema = z.object({
  patientId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid patient id"),
  doctorId: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid doctor id"),
  queuedAt: z.string().datetime().optional(),
  isPriority: z.boolean().optional(),
  notes: z.string().trim().max(500).optional()
});

const queueRouter = Router();

queueRouter.use(requireAuth);

queueRouter.get("/", requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"), QueueController.list);
queueRouter.post(
  "/",
  requireRole("ADMIN", "RECEPTION", "DOCTOR"),
  validateBody(createQueueEntrySchema),
  QueueController.create
);
queueRouter.get(
  "/:id",
  requireRole("ADMIN", "RECEPTION", "DOCTOR", "NURSE"),
  validateParams(queueEntryIdParamsSchema),
  QueueController.getById
);
queueRouter.patch(
  "/:id/start",
  requireRole("ADMIN", "DOCTOR"),
  validateParams(queueEntryIdParamsSchema),
  QueueController.start
);
queueRouter.patch(
  "/:id/complete",
  requireRole("ADMIN", "DOCTOR"),
  validateParams(queueEntryIdParamsSchema),
  QueueController.complete
);
queueRouter.patch(
  "/:id/cancel",
  requireRole("ADMIN", "RECEPTION", "DOCTOR"),
  validateParams(queueEntryIdParamsSchema),
  QueueController.cancel
);

export { queueRouter };

