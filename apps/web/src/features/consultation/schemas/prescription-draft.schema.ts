import { z } from "zod";

export const prescriptionDraftSchema = z.object({
  medicineId: z.string().min(1, "Medicine is required"),
  dosage: z.string().max(80, "Dosage must be 80 characters or less").optional(),
  frequency: z.string().max(80, "Frequency must be 80 characters or less").optional(),
  durationDays: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), "Duration must be a valid number"),
  instructions: z.string().max(400, "Instructions must be 400 characters or less").optional()
});

export type PrescriptionDraftValues = z.infer<typeof prescriptionDraftSchema>;

export function normalizePrescriptionDraft(values: PrescriptionDraftValues) {
  const dosage = values.dosage?.trim() ?? "";
  const frequency = values.frequency?.trim() ?? "";
  const instructions = values.instructions?.trim() ?? "";

  return {
    medicineId: values.medicineId.trim(),
    dosage,
    frequency,
    durationDays: values.durationDays ? Number.parseInt(values.durationDays, 10) : undefined,
    instructions
  };
}
