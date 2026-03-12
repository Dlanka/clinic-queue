import { isValidObjectId } from "mongoose";
import { PatientModel, type PatientGender, type PatientStatus } from "../models/patient.model";
import { HttpError } from "../utils/http-error";

interface CreatePatientInput {
  tenantId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status?: PatientStatus;
}

interface UpdatePatientInput {
  tenantId: string;
  patientId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status?: PatientStatus;
}

export interface PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status: PatientStatus;
  createdAt: string;
}

function toPatientDto(patient: {
  _id: { toString: () => string };
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  status: PatientStatus;
  createdAt?: Date;
}): PatientDto {
  return {
    id: patient._id.toString(),
    firstName: patient.firstName,
    lastName: patient.lastName,
    fullName: `${patient.firstName} ${patient.lastName}`.trim(),
    dateOfBirth: patient.dateOfBirth?.toISOString(),
    gender: patient.gender,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    status: patient.status,
    createdAt: patient.createdAt?.toISOString() ?? new Date().toISOString()
  };
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

export class PatientService {
  static async list(tenantId: string) {
    const patients = await PatientModel.find({ tenantId }).sort({ createdAt: -1 }).lean();
    return patients.map((patient) => toPatientDto(patient));
  }

  static async create(input: CreatePatientInput) {
    const patient = await PatientModel.create({
      tenantId: input.tenantId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      gender: input.gender,
      phone: normalizeString(input.phone),
      email: normalizeString(input.email)?.toLowerCase(),
      address: normalizeString(input.address),
      status: input.status ?? "ACTIVE"
    });

    return toPatientDto(patient.toObject());
  }

  static async getById(tenantId: string, patientId: string) {
    if (!isValidObjectId(patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }

    const patient = await PatientModel.findOne({ _id: patientId, tenantId }).lean();
    if (!patient) {
      throw new HttpError(404, "Patient not found");
    }

    return toPatientDto(patient);
  }

  static async update(input: UpdatePatientInput) {
    if (!isValidObjectId(input.patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }

    const updatePayload: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: Date;
      gender?: PatientGender;
      phone?: string;
      email?: string;
      address?: string;
      status?: PatientStatus;
    } = {};

    if (input.firstName !== undefined) {
      updatePayload.firstName = input.firstName.trim();
    }
    if (input.lastName !== undefined) {
      updatePayload.lastName = input.lastName.trim();
    }
    if (input.dateOfBirth !== undefined) {
      updatePayload.dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : undefined;
    }
    if (input.gender !== undefined) {
      updatePayload.gender = input.gender;
    }
    if (input.phone !== undefined) {
      updatePayload.phone = normalizeString(input.phone);
    }
    if (input.email !== undefined) {
      updatePayload.email = normalizeString(input.email)?.toLowerCase();
    }
    if (input.address !== undefined) {
      updatePayload.address = normalizeString(input.address);
    }
    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }

    const patient = await PatientModel.findOneAndUpdate(
      { _id: input.patientId, tenantId: input.tenantId },
      updatePayload,
      { returnDocument: "after" }
    ).lean();

    if (!patient) {
      throw new HttpError(404, "Patient not found");
    }

    return toPatientDto(patient);
  }

  static async remove(tenantId: string, patientId: string) {
    if (!isValidObjectId(patientId)) {
      throw new HttpError(400, "Invalid patient id");
    }

    const patient = await PatientModel.findOneAndUpdate(
      { _id: patientId, tenantId },
      { status: "INACTIVE" },
      { returnDocument: "after" }
    ).lean();

    if (!patient) {
      throw new HttpError(404, "Patient not found");
    }
  }
}
