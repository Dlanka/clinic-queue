import { z } from "zod";

export const prescriptionRowSchema = z.object({
  medicineId: z.string().optional(),
  dosage: z.string().max(80).optional(),
  frequency: z.string().max(80).optional(),
  durationDays: z
    .union([z.number().int().positive().max(365), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && Number.isFinite(value) ? value : undefined)),
  instructions: z.string().max(400).optional()
});

export const consultationSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  symptoms: z.string().max(1000).optional(),
  diagnosis: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  bloodPressure: z.string().max(32).optional(),
  pulse: z
    .union([z.number().positive().max(260), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && Number.isFinite(value) ? value : undefined)),
  temperature: z
    .union([z.number().positive().max(60), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && Number.isFinite(value) ? value : undefined)),
  weight: z
    .union([z.number().positive().max(500), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && Number.isFinite(value) ? value : undefined)),
  prescriptionItems: z.array(prescriptionRowSchema)
});

export type ConsultationValues = z.infer<typeof consultationSchema>;

export function validateCompleteConsultation(values: ConsultationValues) {
  const diagnosis = values.diagnosis?.trim();
  const symptoms = values.symptoms?.trim();
  const notes = values.notes?.trim();

  if (!diagnosis) {
    return "Diagnosis is required to complete consultation.";
  }

  if (!symptoms && !notes) {
    return "Add at least symptoms or notes before completing consultation.";
  }

  return null;
}
