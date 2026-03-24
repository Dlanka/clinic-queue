import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { queueFormSchema, type QueueFormValues } from "../schemas/queue-form.schema";

const queueFormResolver: Resolver<QueueFormValues> = async (values) => {
  const parsed = queueFormSchema.safeParse(values);

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

const queueFormDefaults: QueueFormValues = {
  patientMode: "existing",
  patientId: "",
  doctorId: "",
  visitType: "CONSULTATION",
  isPriority: false,
  notes: "",
  quickFirstName: "",
  quickLastName: "",
  quickPhone: "",
  quickDateOfBirth: "",
  quickGender: "MALE"
};

export function useQueueForm(open: boolean) {
  const form = useForm<QueueFormValues>({
    resolver: queueFormResolver,
    defaultValues: queueFormDefaults
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(queueFormDefaults);
  }, [form, open]);

  return form;
}

