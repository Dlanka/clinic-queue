import { z } from "zod";

export const patientFormSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  phone: z.string().optional(),
  email: z.string().email("Valid email is required").or(z.literal("")).optional(),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
