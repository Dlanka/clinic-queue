import { z } from "zod";

export const queueFormSchema = z
  .object({
    patientMode: z.enum(["existing", "quick"]),
    patientId: z.string().optional(),
    doctorId: z.string().min(1, "Doctor is required"),
    visitType: z.enum(["CONSULTATION", "EMERGENCY"]),
    isPriority: z.boolean(),
    notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
    quickFirstName: z.string().optional(),
    quickLastName: z.string().optional(),
    quickPhone: z.string().optional(),
    quickDateOfBirth: z.string().optional(),
    quickGender: z.enum(["MALE", "FEMALE", "OTHER"]).optional()
  })
  .superRefine((values, context) => {
    if (values.patientMode === "existing") {
      if (!values.patientId?.trim()) {
        context.addIssue({
          code: "custom",
          path: ["patientId"],
          message: "Patient is required"
        });
      }
      return;
    }

    if (!values.quickFirstName?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["quickFirstName"],
        message: "First name is required"
      });
    }

    if (!values.quickLastName?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["quickLastName"],
        message: "Last name is required"
      });
    }
  });

export type QueueFormValues = z.infer<typeof queueFormSchema>;
