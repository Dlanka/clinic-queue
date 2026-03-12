import { Schema, Types, model } from "mongoose";

export type PrescriptionStatus = "PRESCRIBED" | "DISPENSED";

export interface PrescriptionItem {
  medicineId: Types.ObjectId;
  medicineName: string;
  quantity: number;
  dispensedQty: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface Prescription {
  tenantId: Types.ObjectId;
  visitId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  prescribedByMemberId: Types.ObjectId;
  dispensedByMemberId?: Types.ObjectId;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  dispensedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const prescriptionItemSchema = new Schema<PrescriptionItem>(
  {
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
    medicineName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    dispensedQty: { type: Number, required: true, min: 0, default: 0 },
    dosage: { type: String, trim: true },
    frequency: { type: String, trim: true },
    duration: { type: String, trim: true },
    instructions: { type: String, trim: true }
  },
  { _id: false }
);

const prescriptionSchema = new Schema<Prescription>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    visitId: { type: Schema.Types.ObjectId, ref: "Visit", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    prescribedByMemberId: {
      type: Schema.Types.ObjectId,
      ref: "TenantMember",
      required: true,
      index: true
    },
    dispensedByMemberId: { type: Schema.Types.ObjectId, ref: "TenantMember" },
    status: {
      type: String,
      enum: ["PRESCRIBED", "DISPENSED"],
      required: true,
      default: "PRESCRIBED"
    },
    items: { type: [prescriptionItemSchema], required: true, default: [] },
    dispensedAt: { type: Date }
  },
  { timestamps: true }
);

prescriptionSchema.index({ tenantId: 1, visitId: 1 });
prescriptionSchema.index({ tenantId: 1, status: 1, createdAt: -1 });

export const PrescriptionModel = model<Prescription>("Prescription", prescriptionSchema);
