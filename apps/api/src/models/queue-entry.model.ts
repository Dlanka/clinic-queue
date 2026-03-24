import { Schema, Types, model } from "mongoose";

export type QueueEntryStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface QueueEntry {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  queueDate: Date;
  queueNumber: number;
  status: QueueEntryStatus;
  isPriority: boolean;
  notes?: string;
  createdByMemberId: Types.ObjectId;
  startedAt?: Date;
  completedAt?: Date;
}

const queueEntrySchema = new Schema<QueueEntry>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    queueDate: { type: Date, required: true, index: true },
    queueNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "WAITING",
      required: true
    },
    isPriority: { type: Boolean, default: false },
    notes: { type: String, trim: true },
    createdByMemberId: {
      type: Schema.Types.ObjectId,
      ref: "TenantMember",
      required: true,
      index: true
    },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

queueEntrySchema.index({ tenantId: 1, doctorId: 1, queueDate: 1, queueNumber: 1 }, { unique: true });
queueEntrySchema.index({ tenantId: 1, doctorId: 1, queueDate: 1, status: 1 });
queueEntrySchema.index({ tenantId: 1, patientId: 1, queueDate: 1 });

export const QueueEntryModel = model<QueueEntry>("QueueEntry", queueEntrySchema);
