import { isValidObjectId } from "mongoose";
import { DoctorModel } from "../models/doctor.model";
import { MedicineModel } from "../models/medicine.model";
import { PatientModel } from "../models/patient.model";
import { QueueEntryModel } from "../models/queue-entry.model";
import { TenantModel } from "../models/tenant.model";
import {
  PrescriptionModel,
  type PrescriptionStatus
} from "../models/prescription.model";
import { VisitModel } from "../models/visit.model";
import { SettingsService } from "./settings.service";
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

interface UpdatePrescriptionInput {
  tenantId: string;
  prescriptionId: string;
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
  queueEntryId?: string;
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

function formatDateTime(value?: string) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function compactText(value?: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "-";
}

function parseThermalWidth(template?: string): 58 | 80 {
  const normalized = template?.toLowerCase() ?? "";
  if (normalized.includes("58")) {
    return 58;
  }
  return 80;
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
  const visit = await VisitModel.findOne({ _id: prescription.visitId, tenantId })
    .select("queueEntryId")
    .lean();

  const patientName = patient ? `${patient.firstName} ${patient.lastName}`.trim() : "Unknown Patient";
  const doctorName = doctor?.name ?? "Unknown Doctor";

  return {
    id: prescription._id.toString(),
    visitId: prescription.visitId.toString(),
    queueEntryId: visit?.queueEntryId?.toString(),
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
  static async list(tenantId: string, status?: PrescriptionStatus, visitId?: string) {
    if (visitId && !isValidObjectId(visitId)) {
      throw new HttpError(400, "Invalid visit id");
    }

    const filter: {
      tenantId: string;
      status?: PrescriptionStatus;
      visitId?: string;
    } = { tenantId };
    if (status) {
      filter.status = status;
    }
    if (visitId) {
      filter.visitId = visitId;
    }

    const prescriptions = await PrescriptionModel.find(filter).sort({ createdAt: -1 }).lean();

    // For general listing (pharmacy queue), hide prescriptions linked to currently in-progress consultations.
    // For visit-specific listing (consultation detail), always return records.
    const visiblePrescriptions = visitId
      ? prescriptions
      : await (async () => {
          const visitIds = [...new Set(prescriptions.map((prescription) => prescription.visitId.toString()))];
          const visits = await VisitModel.find({
            _id: { $in: visitIds },
            tenantId
          })
            .select("_id queueEntryId")
            .lean();

          const visitById = new Map(visits.map((visit) => [visit._id.toString(), visit]));
          const queueEntryIds = visits
            .map((visit) => visit.queueEntryId?.toString())
            .filter((value): value is string => Boolean(value));

          const queueEntries =
            queueEntryIds.length > 0
              ? await QueueEntryModel.find({
                  _id: { $in: queueEntryIds },
                  tenantId
                })
                  .select("_id status")
                  .lean()
              : [];

          const queueStatusById = new Map(
            queueEntries.map((entry) => [entry._id.toString(), entry.status])
          );

          return prescriptions.filter((prescription) => {
            const visit = visitById.get(prescription.visitId.toString());
            const queueEntryId = visit?.queueEntryId?.toString();
            if (!queueEntryId) {
              return true;
            }

            return queueStatusById.get(queueEntryId) !== "IN_PROGRESS";
          });
        })();

    const result: PrescriptionDto[] = [];
    for (const prescription of visiblePrescriptions) {
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

  static async update(input: UpdatePrescriptionInput) {
    if (!isValidObjectId(input.prescriptionId)) {
      throw new HttpError(400, "Invalid prescription id");
    }

    const prescription = await PrescriptionModel.findOne({
      _id: input.prescriptionId,
      tenantId: input.tenantId
    });

    if (!prescription) {
      throw new HttpError(404, "Prescription not found");
    }

    const settings = await SettingsService.getByTenantId(input.tenantId);

    if (prescription.status === "PRESCRIBED" && !settings?.pharmacy?.allowEditBeforeDispense) {
      throw new HttpError(409, "Editing prescribed medicines is disabled by tenant settings");
    }

    if (prescription.status === "DISPENSED" && !settings?.pharmacy?.allowEditAfterDispense) {
      throw new HttpError(409, "Dispensed prescription cannot be modified");
    }

    if (prescription.status === "DISPENSED") {
      throw new HttpError(
        409,
        "Edit-after-dispense is enabled, but updating dispensed medicines is not supported yet"
      );
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

    prescription.prescribedByMemberId = input.prescribedByMemberId as never;
    prescription.items = input.items.map((item) => {
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
    }) as never;

    await prescription.save();
    return decoratePrescription(input.tenantId, prescription.toObject());
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

  static async generatePrintPdf(
    tenantId: string,
    prescriptionId: string,
    options: { paperWidthMm?: 58 | 80 } = {}
  ) {
    const prescription = await this.getById(tenantId, prescriptionId);
    const [tenant, settings] = await Promise.all([
      TenantModel.findOne({ _id: tenantId }).select("name").lean(),
      SettingsService.getByTenantId(tenantId)
    ]);

    const defaultWidth = parseThermalWidth(settings?.pharmacy?.thermalPrintTemplate);
    const paperWidthMm = options.paperWidthMm ?? defaultWidth;
    const pageWidthPt = paperWidthMm === 58 ? 164 : 226;
    const pdfTitle = `RX-${prescription.id.slice(-4).toUpperCase()}`;

    const medicationBlocks = prescription.items.map((item, index) => ({
      stack: [
        {
          text: `${index + 1}. ${item.medicineName}`,
          bold: true,
          fontSize: 10
        },
        {
          text: [
            item.dosage?.trim() || "-",
            item.frequency?.trim() || "-",
            item.duration?.trim() || "-"
          ].join(" \u00B7 "),
          fontSize: 9,
          color: "#37474F"
        },
      ],
      margin: [0, 0, 0, 6] as [number, number, number, number]
    }));

    for (let index = 0; index < prescription.items.length; index += 1) {
      const item = prescription.items[index];
      const block = medicationBlocks[index];
      if (!item || !block || !item.instructions?.trim()) {
        continue;
      }

      block.stack.push({
        text: `Note: ${item.instructions.trim()}`,
        fontSize: 8,
        color: "#455A64"
      });
    }

    const docDefinition = {
      pageSize: {
        width: pageWidthPt,
        height: "auto"
      },
      pageMargins: [10, 10, 10, 10],
      defaultStyle: {
        font: "Helvetica",
        fontSize: 9,
        lineHeight: 1.25
      },
      content: [
        {
          text: tenant?.name?.trim() || "Clinic Queue",
          bold: true,
          fontSize: 12,
          alignment: "center"
        },
        {
          text: "Prescription",
          bold: true,
          alignment: "center",
          margin: [0, 2, 0, 6]
        },
        { text: pdfTitle, bold: true },
        { text: `Date: ${formatDateTime(prescription.createdAt)}` },
        { text: `Patient: ${compactText(prescription.patientName)}` },
        { text: `Doctor: ${compactText(prescription.doctorName)}` },
        {
          text: `Status: ${prescription.status === "DISPENSED" ? "Dispensed" : "Prescribed"}`,
          margin: [0, 0, 0, 4]
        },
        {
          canvas: [{ type: "line", x1: 0, y1: 0, x2: pageWidthPt - 20, y2: 0, lineWidth: 0.5 }]
        },
        { text: "MEDICINES", bold: true, margin: [0, 4, 0, 4] },
        ...medicationBlocks,
        {
          canvas: [{ type: "line", x1: 0, y1: 0, x2: pageWidthPt - 20, y2: 0, lineWidth: 0.5 }],
          margin: [0, 2, 0, 4]
        },
        {
          text: "Generated by Clinic Queue",
          alignment: "center",
          fontSize: 8,
          color: "#607D8B",
          margin: [0, 8, 0, 0]
        }
      ]
    };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PdfPrinter = require("pdfmake");
    const printer = new PdfPrinter({
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique"
      }
    });

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.on("data", (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.on("error", reject);
      pdfDoc.end();
    });
  }
}
