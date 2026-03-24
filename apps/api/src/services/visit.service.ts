import { isValidObjectId } from "mongoose";
import { DoctorModel } from "../models/doctor.model";
import { PatientModel } from "../models/patient.model";
import { VisitModel } from "../models/visit.model";
import { HttpError } from "../utils/http-error";

interface CreateVisitInput {
  tenantId: string;
  patientId: string;
  doctorId: string;
  queueEntryId?: string;
  createdByMemberId: string;
  visitedAt?: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
}

interface UpdateVisitInput {
  tenantId: string;
  patientId: string;
  visitId: string;
  visitedAt?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
}

export interface VisitDto {
  id: string;
  patientId: string;
  doctorId: string;
  queueEntryId?: string;
  doctorName: string;
  createdByMemberId: string;
  visitedAt: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  weight?: number;
  createdAt: string;
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

function toVisitDto(
  visit: {
    _id: { toString: () => string };
    patientId: { toString: () => string };
    doctorId: { toString: () => string };
    queueEntryId?: { toString: () => string };
    createdByMemberId: { toString: () => string };
    visitedAt: Date;
    symptoms: string;
    diagnosis?: string;
    notes?: string;
    bloodPressure?: string;
    pulse?: number;
    temperature?: number;
    weight?: number;
    createdAt?: Date;
  },
  doctorName: string
): VisitDto {
  return {
    id: visit._id.toString(),
    patientId: visit.patientId.toString(),
    doctorId: visit.doctorId.toString(),
    queueEntryId: visit.queueEntryId?.toString(),
    doctorName,
    createdByMemberId: visit.createdByMemberId.toString(),
    visitedAt: visit.visitedAt.toISOString(),
    symptoms: visit.symptoms,
    diagnosis: visit.diagnosis,
    notes: visit.notes,
    bloodPressure: visit.bloodPressure,
    pulse: visit.pulse,
    temperature: visit.temperature,
    weight: visit.weight,
    createdAt: visit.createdAt?.toISOString() ?? new Date().toISOString()
  };
}

export class VisitService {
  static async listByPatient(tenantId: string, patientId: string) {
    if (!isValidObjectId(patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }

    const patient = await PatientModel.findOne({ _id: patientId, tenantId }).select("_id").lean();
    if (!patient) {
      throw new HttpError(404, "Patient not found");
    }

    const visits = await VisitModel.find({ tenantId, patientId }).sort({ visitedAt: -1 }).lean();
    if (visits.length === 0) {
      return [];
    }

    const doctorIds = [...new Set(visits.map((visit) => visit.doctorId.toString()))];
    const doctors = await DoctorModel.find({
      _id: { $in: doctorIds },
      tenantId
    })
      .select("_id name")
      .lean();

    const doctorById = new Map(doctors.map((doctor) => [doctor._id.toString(), doctor.name]));

    return visits.map((visit) => toVisitDto(visit, doctorById.get(visit.doctorId.toString()) ?? "Unknown Doctor"));
  }

  static async getByQueueEntry(tenantId: string, queueEntryId: string) {
    if (!isValidObjectId(queueEntryId)) {
      throw new HttpError(400, "Invalid queue entry id");
    }

    const visit = await VisitModel.findOne({ tenantId, queueEntryId }).sort({ visitedAt: -1 }).lean();
    if (!visit) {
      return null;
    }

    const doctor = await DoctorModel.findOne({ _id: visit.doctorId, tenantId }).select("name").lean();
    return toVisitDto(visit, doctor?.name ?? "Unknown Doctor");
  }

  static async create(input: CreateVisitInput) {
    if (!isValidObjectId(input.patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }
    if (!isValidObjectId(input.doctorId)) {
      throw new HttpError(400, "Invalid doctor id");
    }
    if (input.queueEntryId && !isValidObjectId(input.queueEntryId)) {
      throw new HttpError(400, "Invalid queue entry id");
    }

    const [patient, doctor] = await Promise.all([
      PatientModel.findOne({ _id: input.patientId, tenantId: input.tenantId }).select("_id").lean(),
      DoctorModel.findOne({
        _id: input.doctorId,
        tenantId: input.tenantId,
        status: "ACTIVE"
      })
        .select("_id name")
        .lean()
    ]);

    if (!patient) {
      throw new HttpError(404, "Patient not found");
    }
    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }

    const visit = await VisitModel.create({
      tenantId: input.tenantId,
      patientId: input.patientId,
      doctorId: input.doctorId,
      queueEntryId: input.queueEntryId,
      createdByMemberId: input.createdByMemberId,
      visitedAt: input.visitedAt ? new Date(input.visitedAt) : new Date(),
      symptoms: input.symptoms.trim(),
      diagnosis: normalizeString(input.diagnosis),
      notes: normalizeString(input.notes),
      bloodPressure: normalizeString(input.bloodPressure),
      pulse: input.pulse,
      temperature: input.temperature,
      weight: input.weight
    });

    return toVisitDto(visit.toObject(), doctor.name);
  }

  static async update(input: UpdateVisitInput) {
    if (!isValidObjectId(input.patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }
    if (!isValidObjectId(input.visitId)) {
      throw new HttpError(400, "Invalid visit id");
    }

    const visit = await VisitModel.findOne({
      _id: input.visitId,
      tenantId: input.tenantId,
      patientId: input.patientId
    });

    if (!visit) {
      throw new HttpError(404, "Visit not found");
    }

    if (typeof input.visitedAt === "string") {
      visit.visitedAt = new Date(input.visitedAt);
    }
    if (typeof input.symptoms === "string") {
      visit.symptoms = input.symptoms.trim();
    }
    if (typeof input.diagnosis === "string") {
      visit.diagnosis = normalizeString(input.diagnosis);
    }
    if (typeof input.notes === "string") {
      visit.notes = normalizeString(input.notes);
    }
    if (typeof input.bloodPressure === "string") {
      visit.bloodPressure = normalizeString(input.bloodPressure);
    }
    if (typeof input.pulse === "number") {
      visit.pulse = input.pulse;
    }
    if (typeof input.temperature === "number") {
      visit.temperature = input.temperature;
    }
    if (typeof input.weight === "number") {
      visit.weight = input.weight;
    }

    await visit.save();

    const doctor = await DoctorModel.findOne({ _id: visit.doctorId, tenantId: input.tenantId })
      .select("name")
      .lean();

    return toVisitDto(visit.toObject(), doctor?.name ?? "Unknown Doctor");
  }
}
