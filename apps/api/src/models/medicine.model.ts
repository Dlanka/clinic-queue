import { Schema, Types, model } from "mongoose";

export type MedicineStatus = "ACTIVE" | "INACTIVE";

export interface Medicine {
  tenantId: Types.ObjectId;
  name: string;
  category?: string;
  unit?: string;
  stockQty: number;
  reorderLevel: number;
  price?: number;
  status: MedicineStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const medicineSchema = new Schema<Medicine>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    unit: { type: String, trim: true },
    stockQty: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, min: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE", required: true }
  },
  { timestamps: true }
);

medicineSchema.index({ tenantId: 1, name: 1 });
medicineSchema.index({ tenantId: 1, stockQty: 1, reorderLevel: 1 });

export const MedicineModel = model<Medicine>("Medicine", medicineSchema);
