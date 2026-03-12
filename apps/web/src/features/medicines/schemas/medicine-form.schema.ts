import { z } from "zod";

export const medicineFormSchema = z.object({
  name: z.string().trim().min(2, "Medicine name is required"),
  category: z.string().optional(),
  unit: z.string().optional(),
  stockQty: z.coerce.number().min(0, "Stock must be non-negative"),
  reorderLevel: z.coerce.number().min(0, "Reorder level must be non-negative"),
  price: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"])
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;
