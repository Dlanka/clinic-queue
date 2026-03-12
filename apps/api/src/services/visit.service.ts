import { isValidObjectId } from "mongoose";
import { DoctorModel } from "../models/doctor.model";
import { PatientModel } from "../models/patient.model";
import { VisitModel } from "../models/visit.model";
import { HttpError } from "../utils/http-error";

interface CreateVisitInput {
  tenantId: string;
  patientId: string;
  doctorId: string;
  createdByMemberId: string;
  visitedAt?: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
}

export interface VisitDto {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  createdByMemberId: string;
  visitedAt: string;
  symptoms: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
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

    return visits.map((visit) => ({
      id: visit._id.toString(),
      patientId: visit.patientId.toString(),
      doctorId: visit.doctorId.toString(),
      doctorName: doctorById.get(visit.doctorId.toString()) ?? "Unknown Doctor",
      createdByMemberId: visit.createdByMemberId.toString(),
      visitedAt: visit.visitedAt.toISOString(),
      symptoms: visit.symptoms,
      diagnosis: visit.diagnosis,
      notes: visit.notes,
      createdAt: visit.createdAt?.toISOString() ?? new Date().toISOString()
    }));
  }

  static async create(input: CreateVisitInput) {
    if (!isValidObjectId(input.patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }
    if (!isValidObjectId(input.doctorId)) {
      throw new HttpError(400, "Invalid doctor id");
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
      createdByMemberId: input.createdByMemberId,
      visitedAt: input.visitedAt ? new Date(input.visitedAt) : new Date(),
      symptoms: input.symptoms.trim(),
      diagnosis: normalizeString(input.diagnosis),
      notes: normalizeString(input.notes)
    });

    return {
      id: visit._id.toString(),
      patientId: visit.patientId.toString(),
      doctorId: visit.doctorId.toString(),
      doctorName: doctor.name,
      createdByMemberId: visit.createdByMemberId.toString(),
      visitedAt: visit.visitedAt.toISOString(),
      symptoms: visit.symptoms,
      diagnosis: visit.diagnosis,
      notes: visit.notes,
      createdAt: visit.createdAt?.toISOString() ?? new Date().toISOString()
    };
  }
}
