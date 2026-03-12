import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import type { Medicine } from "@/services/medicine.service";
import { medicineFormSchema, type MedicineFormValues } from "../schemas/medicine-form.schema";

const medicineFormResolver: Resolver<MedicineFormValues> = async (values) => {
  const parsed = medicineFormSchema.safeParse(values);

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

export function useMedicineForm(open: boolean, medicine: Medicine | null) {
  const form = useForm<MedicineFormValues>({
    resolver: medicineFormResolver,
    defaultValues: {
      name: medicine?.name ?? "",
      category: medicine?.category ?? "",
      unit: medicine?.unit ?? "",
      stockQty: medicine?.stockQty ?? 0,
      reorderLevel: medicine?.reorderLevel ?? 0,
      price: medicine?.price ?? "",
      status: medicine?.status ?? "ACTIVE"
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      name: medicine?.name ?? "",
      category: medicine?.category ?? "",
      unit: medicine?.unit ?? "",
      stockQty: medicine?.stockQty ?? 0,
      reorderLevel: medicine?.reorderLevel ?? 0,
      price: medicine?.price ?? "",
      status: medicine?.status ?? "ACTIVE"
    });
  }, [form, medicine, open]);

  return form;
}
