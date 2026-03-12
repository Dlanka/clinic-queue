import { z } from "zod";

export const visitFormSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  visitedAt: z.string().optional(),
  symptoms: z.string().trim().min(2, "Symptoms are required"),
  diagnosis: z.string().optional(),
  notes: z.string().optional()
});

export type VisitFormValues = z.infer<typeof visitFormSchema>;
