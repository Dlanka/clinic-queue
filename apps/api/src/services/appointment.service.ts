import { isValidObjectId } from "mongoose";
import {
  AppointmentModel,
  type AppointmentStatus
} from "../models/appointment.model";
import { DoctorModel } from "../models/doctor.model";
import { PatientModel } from "../models/patient.model";
import { HttpError } from "../utils/http-error";

interface ListAppointmentsFilters {
  status?: AppointmentStatus;
}

interface CreateAppointmentInput {
  tenantId: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  status?: AppointmentStatus;
  notes?: string;
}

interface UpdateAppointmentInput {
  tenantId: string;
  appointmentId: string;
  patientId?: string;
  doctorId?: string;
  scheduledAt?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface AppointmentDto {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

async function ensurePatientExists(tenantId: string, patientId: string) {
  if (!isValidObjectId(patientId)) {
    throw new HttpError(400, "Invalid patient id");
  }

  const patient = await PatientModel.findOne({ _id: patientId, tenantId }).select("_id").lean();
  if (!patient) {
    throw new HttpError(404, "Patient not found");
  }
}

async function ensureDoctorExists(tenantId: string, doctorId: string) {
  if (!isValidObjectId(doctorId)) {
    throw new HttpError(400, "Invalid doctor id");
  }

  const doctor = await DoctorModel.findOne({ _id: doctorId, tenantId }).select("_id").lean();
  if (!doctor) {
    throw new HttpError(404, "Doctor not found");
  }
}

async function ensureNoDoubleBooking(
  tenantId: string,
  doctorId: string,
  scheduledAt: Date,
  excludeAppointmentId?: string
) {
  const filter: {
    tenantId: string;
    doctorId: string;
    scheduledAt: Date;
    status: { $ne: "CANCELLED" };
    _id?: { $ne: string };
  } = {
    tenantId,
    doctorId,
    scheduledAt,
    status: { $ne: "CANCELLED" }
  };

  if (excludeAppointmentId) {
    filter._id = { $ne: excludeAppointmentId };
  }

  const booked = await AppointmentModel.findOne(filter).select("_id").lean();
  if (booked) {
    throw new HttpError(409, "Doctor already has an appointment at this time");
  }
}

function toAppointmentDto(appointment: {
  _id: { toString: () => string };
  patientId: { toString: () => string };
  doctorId: { toString: () => string };
  scheduledAt: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: Date;
}): AppointmentDto {
  const patient = (appointment as { patientId?: { fullName?: string } }).patientId;
  const doctor = (appointment as { doctorId?: { name?: string } }).doctorId;

  return {
    id: appointment._id.toString(),
    patientId: appointment.patientId.toString(),
    patientName: patient?.fullName ?? "Unknown Patient",
    doctorId: appointment.doctorId.toString(),
    doctorName: doctor?.name ?? "Unknown Doctor",
    scheduledAt: appointment.scheduledAt.toISOString(),
    status: appointment.status,
    notes: appointment.notes,
    createdAt: appointment.createdAt?.toISOString() ?? new Date().toISOString()
  };
}

export class AppointmentService {
  static async list(tenantId: string, filters: ListAppointmentsFilters = {}) {
    const query = filters.status
      ? { tenantId, status: filters.status }
      : { tenantId };

    const appointments = await AppointmentModel.find(query)
      .sort({ scheduledAt: 1 })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .lean();

    return appointments.map((appointment) => {
      const patientNameParts = [
        (appointment.patientId as { firstName?: string })?.firstName ?? "",
        (appointment.patientId as { lastName?: string })?.lastName ?? ""
      ];
      const patientName = patientNameParts.join(" ").trim();
      const patientId = (appointment.patientId as { _id?: { toString: () => string } })?._id;
      const doctorId = (appointment.doctorId as { _id?: { toString: () => string } })?._id;

      if (!patientId || !doctorId) {
        throw new HttpError(409, "Appointment has missing patient or doctor relation");
      }

      return toAppointmentDto({
        ...appointment,
        patientId: Object.assign(patientId, {
          toString: () => patientId.toString(),
          fullName: patientName || "Unknown Patient"
        }),
        doctorId: Object.assign(doctorId, {
          toString: () => doctorId.toString(),
          name:
            ((appointment.doctorId as { name?: string })?.name || "").trim() ||
            "Unknown Doctor"
        })
      });
    });
  }

  static async create(input: CreateAppointmentInput) {
    await Promise.all([
      ensurePatientExists(input.tenantId, input.patientId),
      ensureDoctorExists(input.tenantId, input.doctorId)
    ]);

    const scheduledAt = new Date(input.scheduledAt);
    await ensureNoDoubleBooking(input.tenantId, input.doctorId, scheduledAt);

    const appointment = await AppointmentModel.create({
      tenantId: input.tenantId,
      patientId: input.patientId,
      doctorId: input.doctorId,
      scheduledAt,
      status: input.status ?? "SCHEDULED",
      notes: normalizeString(input.notes)
    });

    return this.getById(input.tenantId, appointment._id.toString());
  }

  static async getById(tenantId: string, appointmentId: string) {
    if (!isValidObjectId(appointmentId)) {
      throw new HttpError(400, "Invalid appointment id");
    }

    const appointment = await AppointmentModel.findOne({ _id: appointmentId, tenantId })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .lean();

    if (!appointment) {
      throw new HttpError(404, "Appointment not found");
    }

    const patientId = (appointment.patientId as { _id?: { toString: () => string } })?._id;
    const doctorId = (appointment.doctorId as { _id?: { toString: () => string } })?._id;

    if (!patientId || !doctorId) {
      throw new HttpError(409, "Appointment has missing patient or doctor relation");
    }

    const patientNameParts = [
      (appointment.patientId as { firstName?: string })?.firstName ?? "",
      (appointment.patientId as { lastName?: string })?.lastName ?? ""
    ];
    const patientName = patientNameParts.join(" ").trim();
    const doctorName = ((appointment.doctorId as { name?: string })?.name || "").trim();

    return toAppointmentDto({
      ...appointment,
      patientId: Object.assign(patientId, {
        toString: () => patientId.toString(),
        fullName: patientName || "Unknown Patient"
      }),
      doctorId: Object.assign(doctorId, {
        toString: () => doctorId.toString(),
        name: doctorName || "Unknown Doctor"
      })
    });
  }

  static async update(input: UpdateAppointmentInput) {
    if (!isValidObjectId(input.appointmentId)) {
      throw new HttpError(400, "Invalid appointment id");
    }

    const existing = await AppointmentModel.findOne({
      _id: input.appointmentId,
      tenantId: input.tenantId
    }).lean();

    if (!existing) {
      throw new HttpError(404, "Appointment not found");
    }

    const nextPatientId = input.patientId ?? existing.patientId.toString();
    const nextDoctorId = input.doctorId ?? existing.doctorId.toString();
    const nextScheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : existing.scheduledAt;

    if (input.patientId !== undefined) {
      await ensurePatientExists(input.tenantId, input.patientId);
    }
    if (input.doctorId !== undefined) {
      await ensureDoctorExists(input.tenantId, input.doctorId);
    }

    const shouldCheckBooking =
      input.doctorId !== undefined ||
      input.scheduledAt !== undefined ||
      (input.status !== undefined && input.status !== "CANCELLED");

    if (shouldCheckBooking) {
      await ensureNoDoubleBooking(
        input.tenantId,
        nextDoctorId,
        nextScheduledAt,
        input.appointmentId
      );
    }

    const updatePayload: {
      patientId?: string;
      doctorId?: string;
      scheduledAt?: Date;
      status?: AppointmentStatus;
      notes?: string;
    } = {};

    if (input.patientId !== undefined) {
      updatePayload.patientId = nextPatientId;
    }
    if (input.doctorId !== undefined) {
      updatePayload.doctorId = nextDoctorId;
    }
    if (input.scheduledAt !== undefined) {
      updatePayload.scheduledAt = nextScheduledAt;
    }
    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }
    if (input.notes !== undefined) {
      updatePayload.notes = normalizeString(input.notes);
    }

    await AppointmentModel.findOneAndUpdate(
      { _id: input.appointmentId, tenantId: input.tenantId },
      updatePayload,
      { returnDocument: "after" }
    ).lean();

    return this.getById(input.tenantId, input.appointmentId);
  }

  static async remove(tenantId: string, appointmentId: string) {
    if (!isValidObjectId(appointmentId)) {
      throw new HttpError(400, "Invalid appointment id");
    }

    const deleted = await AppointmentModel.findOneAndDelete({ _id: appointmentId, tenantId }).lean();
    if (!deleted) {
      throw new HttpError(404, "Appointment not found");
    }
  }
}
