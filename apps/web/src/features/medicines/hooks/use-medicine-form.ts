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

function parseNonNegativeInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

export function useMedicineForm(
  open: boolean,
  medicine: Medicine | null,
  defaultLowStockThreshold?: string
) {
  const defaultReorderLevel = parseNonNegativeInt(defaultLowStockThreshold, 0);

  const form = useForm<MedicineFormValues>({
    resolver: medicineFormResolver,
    defaultValues: {
      name: medicine?.name ?? "",
      category: medicine?.category ?? "",
      unit: medicine?.unit ?? "",
      stockQty: medicine?.stockQty ?? 0,
      reorderLevel: medicine?.reorderLevel ?? defaultReorderLevel,
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
      reorderLevel: medicine?.reorderLevel ?? defaultReorderLevel,
      price: medicine?.price ?? "",
      status: medicine?.status ?? "ACTIVE"
    });
  }, [defaultReorderLevel, form, medicine, open]);

  return form;
}
