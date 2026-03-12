import { z } from "zod";

export const prescriptionBuilderSchema = z.object({
  items: z
    .array(
      z.object({
        medicineId: z.string().min(1, "Medicine is required"),
        quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.string().optional(),
        instructions: z.string().optional()
      })
    )
    .min(1, "At least one item is required")
});

export type PrescriptionBuilderValues = z.infer<typeof prescriptionBuilderSchema>;
