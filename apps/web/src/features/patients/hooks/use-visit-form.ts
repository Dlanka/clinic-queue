import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { visitFormSchema, type VisitFormValues } from "../schemas/visit-form.schema";

const visitFormResolver: Resolver<VisitFormValues> = async (values) => {
  const parsed = visitFormSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (accumulator, issue) => {
      const fieldName = String(issue.path[0] ?? "root");
      accumulator[fieldName] = { type: "manual", message: issue.message };
      return accumulator;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

export function useVisitForm(selectedPatientId: string | null) {
  const form = useForm<VisitFormValues>({
    resolver: visitFormResolver,
    defaultValues: {
      doctorId: "",
      visitedAt: "",
      symptoms: "",
      diagnosis: "",
      notes: ""
    }
  });

  useEffect(() => {
    form.reset({
      doctorId: "",
      visitedAt: "",
      symptoms: "",
      diagnosis: "",
      notes: ""
    });
  }, [form, selectedPatientId]);

  return form;
}
