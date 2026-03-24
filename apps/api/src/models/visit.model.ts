import { Schema, Types, model } from "mongoose";

export interface Visit {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  queueEntryId?: Types.ObjectId;
  createdByMemberId: Types.ObjectId;
  visitedAt: Date;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const visitSchema = new Schema<Visit>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    queueEntryId: { type: Schema.Types.ObjectId, ref: "QueueEntry", index: true },
    createdByMemberId: {
      type: Schema.Types.ObjectId,
      ref: "TenantMember",
      required: true,
      index: true
    },
    visitedAt: { type: Date, required: true, default: () => new Date() },
    symptoms: { type: String, required: true, trim: true },
    diagnosis: { type: String, trim: true },
    notes: { type: String, trim: true },
    bloodPressure: { type: String, trim: true },
    pulse: { type: Number },
    temperature: { type: Number },
    weight: { type: Number }
  },
  { timestamps: true }
);

visitSchema.index({ tenantId: 1, patientId: 1, visitedAt: -1 });
visitSchema.index({ tenantId: 1, doctorId: 1, visitedAt: -1 });
visitSchema.index({ tenantId: 1, queueEntryId: 1, visitedAt: -1 });

export const VisitModel = model<Visit>("Visit", visitSchema);
