import { isValidObjectId } from "mongoose";
import { MedicineModel, type MedicineStatus } from "../models/medicine.model";
import { HttpError } from "../utils/http-error";

interface CreateMedicineInput {
  tenantId: string;
  name: string;
  category?: string;
  unit?: string;
  stockQty: number;
  reorderLevel: number;
  price?: number;
  status?: MedicineStatus;
}

interface UpdateMedicineInput {
  tenantId: string;
  medicineId: string;
  name?: string;
  category?: string;
  unit?: string;
  stockQty?: number;
  reorderLevel?: number;
  price?: number;
  status?: MedicineStatus;
}

export interface MedicineCategoryOptionDto {
  value: string;
  label: string;
}

export interface MedicineDto {
  id: string;
  name: string;
  category?: string;
  unit?: string;
  stockQty: number;
  reorderLevel: number;
  price?: number;
  status: MedicineStatus;
  isLowStock: boolean;
  createdAt: string;
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

const DEFAULT_MEDICINE_CATEGORIES = [
  "Antibiotics",
  "Analgesics",
  "Antipyretics",
  "Antihistamines",
  "Vitamins",
  "Supplements",
  "Cardiovascular",
  "Diabetes",
  "Dermatology",
  "Gastroenterology"
];

const DEFAULT_MEDICINE_UNITS = [
  "tablet",
  "capsule",
  "bottle",
  "vial",
  "ampoule",
  "syrup",
  "suspension",
  "cream",
  "ointment",
  "inhaler",
  "drop",
  "patch",
  "injection",
  "unit"
];

function toMedicineDto(medicine: {
  _id: { toString: () => string };
  name: string;
  category?: string;
  unit?: string;
  stockQty: number;
  reorderLevel: number;
  price?: number;
  status: MedicineStatus;
  createdAt?: Date;
}): MedicineDto {
  return {
    id: medicine._id.toString(),
    name: medicine.name,
    category: medicine.category,
    unit: medicine.unit,
    stockQty: medicine.stockQty,
    reorderLevel: medicine.reorderLevel,
    price: medicine.price,
    status: medicine.status,
    isLowStock: medicine.stockQty <= medicine.reorderLevel,
    createdAt: medicine.createdAt?.toISOString() ?? new Date().toISOString()
  };
}

export class MedicineService {
  static async listCategories(tenantId: string): Promise<MedicineCategoryOptionDto[]> {
    const tenantCategories = await MedicineModel.distinct("category", {
      tenantId,
      category: { $exists: true, $ne: "" }
    });

    const uniqueCategories = Array.from(
      new Set(
        [...DEFAULT_MEDICINE_CATEGORIES, ...tenantCategories]
          .map((category) => category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    ).sort((a, b) => a.localeCompare(b));

    return uniqueCategories.map((category) => ({
      value: category,
      label: category
    }));
  }

  static async listUnits(tenantId: string): Promise<MedicineCategoryOptionDto[]> {
    const tenantUnits = await MedicineModel.distinct("unit", {
      tenantId,
      unit: { $exists: true, $ne: "" }
    });

    const uniqueUnits = Array.from(
      new Set(
        [...DEFAULT_MEDICINE_UNITS, ...tenantUnits]
          .map((unit) => unit?.trim())
          .filter((unit): unit is string => Boolean(unit))
      )
    ).sort((a, b) => a.localeCompare(b));

    return uniqueUnits.map((unit) => ({
      value: unit,
      label: unit
    }));
  }

  static async list(tenantId: string) {
    const medicines = await MedicineModel.find({ tenantId }).sort({ createdAt: -1 }).lean();
    return medicines.map((medicine) => toMedicineDto(medicine));
  }

  static async create(input: CreateMedicineInput) {
    const medicine = await MedicineModel.create({
      tenantId: input.tenantId,
      name: input.name.trim(),
      category: normalizeString(input.category),
      unit: normalizeString(input.unit),
      stockQty: input.stockQty,
      reorderLevel: input.reorderLevel,
      price: input.price,
      status: input.status ?? "ACTIVE"
    });

    return toMedicineDto(medicine.toObject());
  }

  static async getById(tenantId: string, medicineId: string) {
    if (!isValidObjectId(medicineId)) {
      throw new HttpError(400, "Invalid medicine id");
    }

    const medicine = await MedicineModel.findOne({ _id: medicineId, tenantId }).lean();
    if (!medicine) {
      throw new HttpError(404, "Medicine not found");
    }

    return toMedicineDto(medicine);
  }

  static async update(input: UpdateMedicineInput) {
    if (!isValidObjectId(input.medicineId)) {
      throw new HttpError(400, "Invalid medicine id");
    }

    const updatePayload: {
      name?: string;
      category?: string;
      unit?: string;
      stockQty?: number;
      reorderLevel?: number;
      price?: number;
      status?: MedicineStatus;
    } = {};

    if (input.name !== undefined) {
      updatePayload.name = input.name.trim();
    }
    if (input.category !== undefined) {
      updatePayload.category = normalizeString(input.category);
    }
    if (input.unit !== undefined) {
      updatePayload.unit = normalizeString(input.unit);
    }
    if (input.stockQty !== undefined) {
      updatePayload.stockQty = input.stockQty;
    }
    if (input.reorderLevel !== undefined) {
      updatePayload.reorderLevel = input.reorderLevel;
    }
    if (input.price !== undefined) {
      updatePayload.price = input.price;
    }
    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }

    const medicine = await MedicineModel.findOneAndUpdate(
      { _id: input.medicineId, tenantId: input.tenantId },
      updatePayload,
      { returnDocument: "after" }
    ).lean();

    if (!medicine) {
      throw new HttpError(404, "Medicine not found");
    }

    return toMedicineDto(medicine);
  }

  static async remove(tenantId: string, medicineId: string) {
    if (!isValidObjectId(medicineId)) {
      throw new HttpError(400, "Invalid medicine id");
    }

    const deleted = await MedicineModel.findOneAndDelete({ _id: medicineId, tenantId }).lean();
    if (!deleted) {
      throw new HttpError(404, "Medicine not found");
    }
  }
}
