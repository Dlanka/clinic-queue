import { Schema, Types, model } from "mongoose";

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  tenantId: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
}

const appointmentSchema = new Schema<Appointment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    scheduledAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
      required: true
    },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

appointmentSchema.index({ tenantId: 1, status: 1, scheduledAt: -1 });
appointmentSchema.index({ tenantId: 1, doctorId: 1, scheduledAt: 1 });
appointmentSchema.index({ tenantId: 1, patientId: 1, scheduledAt: -1 });

export const AppointmentModel = model<Appointment>("Appointment", appointmentSchema);
