import { z } from "zod";

export const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  scheduledAtLocal: z.string().min(1, "Date and time are required"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional()
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
