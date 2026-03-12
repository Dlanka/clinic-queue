import { Schema, Types, model } from "mongoose";

export type PatientStatus = "ACTIVE" | "INACTIVE";
export type PatientGender = "MALE" | "FEMALE" | "OTHER";

export interface Patient {
  tenantId: Types.ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status: PatientStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const patientSchema = new Schema<Patient>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"] },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE", required: true }
  },
  { timestamps: true }
);

patientSchema.index({ tenantId: 1, lastName: 1, firstName: 1 });
patientSchema.index({ tenantId: 1, status: 1 });
patientSchema.index({ tenantId: 1, phone: 1 });

export const PatientModel = model<Patient>("Patient", patientSchema);
