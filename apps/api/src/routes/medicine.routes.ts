import { Router } from "express";
import { z } from "zod";
import { MedicineController } from "../controllers/medicine.controller";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateBody, validateParams } from "../middlewares/validate-request";

const medicineIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f0-9]{24}$/i, "Invalid medicine id")
});

const createMedicineSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().max(80).optional(),
  unit: z.string().trim().max(40).optional(),
  stockQty: z.number().min(0),
  reorderLevel: z.number().min(0),
  price: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

const updateMedicineSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    category: z.string().trim().max(80).optional(),
    unit: z.string().trim().max(40).optional(),
    stockQty: z.number().min(0).optional(),
    reorderLevel: z.number().min(0).optional(),
    price: z.number().min(0).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update"
  });

const medicineRouter = Router();

medicineRouter.use(requireAuth);

medicineRouter.get(
  "/",
  requireRole("ADMIN", "PHARMACY_STAFF", "DOCTOR", "NURSE", "RECEPTION"),
  MedicineController.list
);
medicineRouter.post(
  "/",
  requireRole("ADMIN", "PHARMACY_STAFF"),
  validateBody(createMedicineSchema),
  MedicineController.create
);
medicineRouter.get(
  "/:id",
  requireRole("ADMIN", "PHARMACY_STAFF", "DOCTOR", "NURSE", "RECEPTION"),
  validateParams(medicineIdParamsSchema),
  MedicineController.getById
);
medicineRouter.patch(
  "/:id",
  requireRole("ADMIN", "PHARMACY_STAFF"),
  validateParams(medicineIdParamsSchema),
  validateBody(updateMedicineSchema),
  MedicineController.update
);
medicineRouter.delete(
  "/:id",
  requireRole("ADMIN", "PHARMACY_STAFF"),
  validateParams(medicineIdParamsSchema),
  MedicineController.remove
);

export { medicineRouter };
