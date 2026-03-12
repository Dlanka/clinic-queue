import { Schema, Types, model } from "mongoose";

export interface Visit {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  createdByMemberId: Types.ObjectId;
  visitedAt: Date;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const visitSchema = new Schema<Visit>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    createdByMemberId: {
      type: Schema.Types.ObjectId,
      ref: "TenantMember",
      required: true,
      index: true
    },
    visitedAt: { type: Date, required: true, default: () => new Date() },
    symptoms: { type: String, required: true, trim: true },
    diagnosis: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

visitSchema.index({ tenantId: 1, patientId: 1, visitedAt: -1 });
visitSchema.index({ tenantId: 1, doctorId: 1, visitedAt: -1 });

export const VisitModel = model<Visit>("Visit", visitSchema);
