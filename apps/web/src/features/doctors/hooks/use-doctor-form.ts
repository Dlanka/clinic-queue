import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import type { Doctor } from "@/services/doctor.service";
import { doctorFormSchema, type DoctorFormValues } from "../schemas/doctor-form.schema";

const doctorFormResolver: Resolver<DoctorFormValues> = async (values) => {
  const parsed = doctorFormSchema.safeParse(values);

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

export function useDoctorForm(open: boolean, doctor: Doctor | null) {
  const form = useForm<DoctorFormValues>({
    resolver: doctorFormResolver,
    defaultValues: {
      memberId: doctor?.memberId ?? "",
      name: doctor?.name ?? "",
      specialization: doctor?.specialization ?? "",
      licenseNumber: doctor?.licenseNumber ?? "",
      status: doctor?.status ?? "ACTIVE"
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      memberId: doctor?.memberId ?? "",
      name: doctor?.name ?? "",
      specialization: doctor?.specialization ?? "",
      licenseNumber: doctor?.licenseNumber ?? "",
      status: doctor?.status ?? "ACTIVE"
    });
  }, [doctor, form, open]);

  return form;
}
