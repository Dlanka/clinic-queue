import type { Resolver } from "react-hook-form";
import type { PrescriptionDraftValues } from "@/features/consultation/schemas/prescription-draft.schema";
import { prescriptionDraftSchema } from "@/features/consultation/schemas/prescription-draft.schema";

export const prescriptionDraftResolver: Resolver<PrescriptionDraftValues> = async (values) => {
  const parsed = prescriptionDraftSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (accumulator, issue) => {
      const fieldName = String(issue.path.join(".") || "root");
      accumulator[fieldName] = { type: "manual", message: issue.message };
      return accumulator;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};
