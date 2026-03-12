import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import type { Patient } from "@/services/patient.service";
import { patientFormSchema, type PatientFormValues } from "../schemas/patient-form.schema";

const patientFormResolver: Resolver<PatientFormValues> = async (values) => {
  const parsed = patientFormSchema.safeParse(values);

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

export function usePatientForm(open: boolean, patient: Patient | null) {
  const form = useForm<PatientFormValues>({
    resolver: patientFormResolver,
    defaultValues: {
      firstName: patient?.firstName ?? "",
      lastName: patient?.lastName ?? "",
      dateOfBirth: patient?.dateOfBirth?.slice(0, 10) ?? "",
      gender: patient?.gender,
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      address: patient?.address ?? "",
      status: patient?.status ?? "ACTIVE"
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      firstName: patient?.firstName ?? "",
      lastName: patient?.lastName ?? "",
      dateOfBirth: patient?.dateOfBirth?.slice(0, 10) ?? "",
      gender: patient?.gender,
      phone: patient?.phone ?? "",
      email: patient?.email ?? "",
      address: patient?.address ?? "",
      status: patient?.status ?? "ACTIVE"
    });
  }, [form, open, patient]);

  return form;
}
