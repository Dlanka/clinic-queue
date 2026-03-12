import { z } from "zod";

export const doctorFormSchema = z.object({
  memberId: z.string().min(1, "Doctor member is required"),
  name: z.string().min(2, "Name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  licenseNumber: z.string().optional(),
  status: z.enum(["ACTIVE", "DISABLED"])
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
