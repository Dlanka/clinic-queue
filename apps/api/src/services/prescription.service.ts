import { isValidObjectId } from "mongoose";
import { DoctorModel } from "../models/doctor.model";
import { MedicineModel } from "../models/medicine.model";
import { PatientModel } from "../models/patient.model";
import {
  PrescriptionModel,
  type PrescriptionStatus
} from "../models/prescription.model";
import { VisitModel } from "../models/visit.model";
import { HttpError } from "../utils/http-error";

interface PrescriptionItemInput {
  medicineId: string;
  quantity: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

interface CreatePrescriptionInput {
  tenantId: string;
  visitId: string;
  prescribedByMemberId: string;
  items: PrescriptionItemInput[];
}

export interface PrescriptionItemDto {
  medicineId: string;
  medicineName: string;
  quantity: number;
  dispensedQty: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface PrescriptionDto {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  prescribedByMemberId: string;
  dispensedByMemberId?: string;
  status: PrescriptionStatus;
  items: PrescriptionItemDto[];
  dispensedAt?: string;
  createdAt: string;
}

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

function toPrescriptionItemDto(item: {
  medicineId: { toString: () => string };
  medicineName: string;
  quantity: number;
  dispensedQty: number;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}): PrescriptionItemDto {
  return {
    medicineId: item.medicineId.toString(),
    medicineName: item.medicineName,
    quantity: item.quantity,
    dispensedQty: item.dispensedQty,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    instructions: item.instructions
  };
}

async function decoratePrescription(
  tenantId: string,
  prescription: {
    _id: { toString: () => string };
    visitId: { toString: () => string };
    patientId: { toString: () => string };
    doctorId: { toString: () => string };
    prescribedByMemberId: { toString: () => string };
    dispensedByMemberId?: { toString: () => string };
    status: PrescriptionStatus;
    items: Array<{
      medicineId: { toString: () => string };
      medicineName: string;
      quantity: number;
      dispensedQty: number;
      dosage?: string;
      frequency?: string;
      duration?: string;
      instructions?: string;
    }>;
    dispensedAt?: Date;
    createdAt?: Date;
  }
): Promise<PrescriptionDto> {
  const [patient, doctor] = await Promise.all([
    PatientModel.findOne({
      _id: prescription.patientId,
      tenantId
    })
      .select("firstName lastName")
      .lean(),
    DoctorModel.findOne({
      _id: prescription.doctorId,
      tenantId
    })
      .select("name")
      .lean()
  ]);

  const patientName = patient ? `${patient.firstName} ${patient.lastName}`.trim() : "Unknown Patient";
  const doctorName = doctor?.name ?? "Unknown Doctor";

  return {
    id: prescription._id.toString(),
    visitId: prescription.visitId.toString(),
    patientId: prescription.patientId.toString(),
    patientName,
    doctorId: prescription.doctorId.toString(),
    doctorName,
    prescribedByMemberId: prescription.prescribedByMemberId.toString(),
    dispensedByMemberId: prescription.dispensedByMemberId?.toString(),
    status: prescription.status,
    items: prescription.items.map((item) => toPrescriptionItemDto(item)),
    dispensedAt: prescription.dispensedAt?.toISOString(),
    createdAt: prescription.createdAt?.toISOString() ?? new Date().toISOString()
  };
}

export class PrescriptionService {
  static async list(tenantId: string, status?: PrescriptionStatus) {
    const filter = status ? { tenantId, status } : { tenantId };
    const prescriptions = await PrescriptionModel.find(filter).sort({ createdAt: -1 }).lean();

    const result: PrescriptionDto[] = [];
    for (const prescription of prescriptions) {
      result.push(await decoratePrescription(tenantId, prescription));
    }
    return result;
  }

  static async createForVisit(input: CreatePrescriptionInput) {
    if (!isValidObjectId(input.visitId)) {
      throw new HttpError(400, "Invalid visit id");
    }

    const visit = await VisitModel.findOne({
      _id: input.visitId,
      tenantId: input.tenantId
    })
      .select("_id patientId doctorId")
      .lean();

    if (!visit) {
      throw new HttpError(404, "Visit not found");
    }

    const medicineIds = [...new Set(input.items.map((item) => item.medicineId))];
    for (const medicineId of medicineIds) {
      if (!isValidObjectId(medicineId)) {
        throw new HttpError(400, "Invalid medicine id");
      }
    }

    const medicines = await MedicineModel.find({
      _id: { $in: medicineIds },
      tenantId: input.tenantId,
      status: "ACTIVE"
    })
      .select("_id name")
      .lean();

    if (medicines.length !== medicineIds.length) {
      throw new HttpError(400, "Some medicines are invalid or inactive");
    }

    const medicineById = new Map(medicines.map((medicine) => [medicine._id.toString(), medicine]));

    const prescription = await PrescriptionModel.create({
      tenantId: input.tenantId,
      visitId: visit._id,
      patientId: visit.patientId,
      doctorId: visit.doctorId,
      prescribedByMemberId: input.prescribedByMemberId,
      status: "PRESCRIBED",
      items: input.items.map((item) => {
        const medicine = medicineById.get(item.medicineId);
        if (!medicine) {
          throw new HttpError(400, "Medicine not found");
        }

        return {
          medicineId: medicine._id,
          medicineName: medicine.name,
          quantity: item.quantity,
          dispensedQty: 0,
          dosage: normalizeString(item.dosage),
          frequency: normalizeString(item.frequency),
          duration: normalizeString(item.duration),
          instructions: normalizeString(item.instructions)
        };
      })
    });

    return decoratePrescription(input.tenantId, prescription.toObject());
  }

  static async getById(tenantId: string, prescriptionId: string) {
    if (!isValidObjectId(prescriptionId)) {
      throw new HttpError(400, "Invalid prescription id");
    }

    const prescription = await PrescriptionModel.findOne({
      _id: prescriptionId,
      tenantId
    }).lean();

    if (!prescription) {
      throw new HttpError(404, "Prescription not found");
    }

    return decoratePrescription(tenantId, prescription);
  }

  static async dispense(tenantId: string, prescriptionId: string, dispensedByMemberId: string) {
    if (!isValidObjectId(prescriptionId)) {
      throw new HttpError(400, "Invalid prescription id");
    }

    const prescription = await PrescriptionModel.findOne({
      _id: prescriptionId,
      tenantId
    });

    if (!prescription) {
      throw new HttpError(404, "Prescription not found");
    }
    if (prescription.status === "DISPENSED") {
      throw new HttpError(409, "Prescription already dispensed");
    }

    const medicineIds = prescription.items.map((item) => item.medicineId.toString());
    const medicines = await MedicineModel.find({
      _id: { $in: medicineIds },
      tenantId,
      status: "ACTIVE"
    })
      .select("_id stockQty")
      .lean();

    if (medicines.length !== medicineIds.length) {
      throw new HttpError(400, "Some medicines are missing or inactive");
    }

    const medicineById = new Map(medicines.map((medicine) => [medicine._id.toString(), medicine]));
    for (const item of prescription.items) {
      const medicine = medicineById.get(item.medicineId.toString());
      if (!medicine) {
        throw new HttpError(400, "Medicine not found");
      }
      if (medicine.stockQty < item.quantity) {
        throw new HttpError(409, `${item.medicineName} has insufficient stock`);
      }
    }

    for (const item of prescription.items) {
      await MedicineModel.updateOne(
        { _id: item.medicineId, tenantId },
        { $inc: { stockQty: -item.quantity } }
      );
      item.dispensedQty = item.quantity;
    }

    prescription.status = "DISPENSED";
    prescription.dispensedAt = new Date();
    prescription.dispensedByMemberId = dispensedByMemberId as never;
    await prescription.save();

    return decoratePrescription(tenantId, prescription.toObject());
  }
}
