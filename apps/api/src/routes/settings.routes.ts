import { Router } from "express";
import { z } from "zod";
import { SettingsController } from "../controllers/settings.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody } from "../middlewares/validate-request";

const generalSchema = z.object({
  clinicName: z.string().trim().min(1).max(160).optional(),
  contactNumber: z.string().trim().max(64).optional(),
  timezone: z.string().trim().max(64).optional(),
  currency: z.string().trim().max(64).optional(),
  dateFormat: z.string().trim().max(64).optional(),
  timeFormat: z.string().trim().max(64).optional()
});

const accessSchema = z.object({
  doctorLandingConsultation: z.boolean().optional(),
  enforceRoleMatrix: z.boolean().optional(),
  allowConcurrentSessions: z.boolean().optional(),
  sessionTimeoutMinutes: z.string().trim().max(10).optional(),
  maxLoginAttempts: z.string().trim().max(10).optional()
});

const queueSchema = z.object({
  queuePrefix: z.string().trim().max(20).optional(),
  queueNumberDigits: z.string().trim().max(10).optional(),
  autoRefreshSeconds: z.string().trim().max(10).optional(),
  maxQueueSize: z.string().trim().max(10).optional(),
  allowPriorityQueueEntries: z.boolean().optional(),
  defaultFilterToToday: z.boolean().optional(),
  showWaitTimeEstimates: z.boolean().optional()
});

const clinicalSchema = z.object({
  symptomsRequired: z.boolean().optional(),
  diagnosisRequiredToComplete: z.boolean().optional(),
  lockConsultationAfterCompletion: z.boolean().optional(),
  enableVitalWarnings: z.boolean().optional(),
  editWindowAfterCompletionHours: z.string().trim().max(10).optional(),
  vitalsWarningThreshold: z.string().trim().max(120).optional()
});

const pharmacySchema = z.object({
  defaultLowStockThreshold: z.string().trim().max(10).optional(),
  thermalPrintTemplate: z.string().trim().max(120).optional(),
  printEnabledByDefaultOnDispense: z.boolean().optional(),
  allowEditBeforeDispense: z.boolean().optional(),
  allowEditAfterDispense: z.boolean().optional()
});

const securitySchema = z.object({
  minimumPasswordLength: z.string().trim().max(10).optional(),
  tokenRotationPolicy: z.string().trim().max(120).optional(),
  forceStrongPasswordRule: z.boolean().optional(),
  rotateSessionOnRefresh: z.boolean().optional(),
  showAuditTrailInAdminPages: z.boolean().optional()
});

const systemSchema = z.object({
  dashboardRefreshSeconds: z.string().trim().max(10).optional(),
  defaultTheme: z.string().trim().max(32).optional(),
  enableSoftDeleteBehavior: z.boolean().optional(),
  allowAppointmentDoubleBooking: z.boolean().optional(),
  systemNotes: z.string().trim().max(2000).optional()
});

const updateSettingsSchema = z
  .object({
    general: generalSchema.optional(),
    access: accessSchema.optional(),
    queue: queueSchema.optional(),
    clinical: clinicalSchema.optional(),
    pharmacy: pharmacySchema.optional(),
    security: securitySchema.optional(),
    system: systemSchema.optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one section to update"
  });

const settingsRouter = Router();

settingsRouter.use(requireAuth, requireRole("ADMIN"));

settingsRouter.get("/", SettingsController.get);
settingsRouter.patch("/", validateBody(updateSettingsSchema), SettingsController.update);

export { settingsRouter };

