import { Schema, Types, model } from "mongoose";

export interface Doctor {
  tenantId: Types.ObjectId;
  memberId: Types.ObjectId;
  name: string;
  specialization: string;
  licenseNumber?: string;
  status: "ACTIVE" | "DISABLED";
}

const doctorSchema = new Schema<Doctor>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    memberId: { type: Schema.Types.ObjectId, ref: "TenantMember", required: true, index: true },
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    licenseNumber: { type: String, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED"],
      default: "ACTIVE",
      required: true
    }
  },
  { timestamps: true }
);

doctorSchema.index({ tenantId: 1, name: 1 });
doctorSchema.index({ tenantId: 1, memberId: 1 }, { unique: true });

export const DoctorModel = model<Doctor>("Doctor", doctorSchema);
