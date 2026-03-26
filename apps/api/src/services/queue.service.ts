import { isValidObjectId } from "mongoose";
import { DoctorModel } from "../models/doctor.model";
import { PatientModel } from "../models/patient.model";
import { QueueEntryModel, type QueueEntryStatus } from "../models/queue-entry.model";
import { VisitModel } from "../models/visit.model";
import { SettingsService } from "./settings.service";
import { HttpError } from "../utils/http-error";

interface QueueListFilters {
  status?: QueueEntryStatus;
  date?: string;
  doctorId?: string;
  allDates?: boolean;
}

interface CreateQueueEntryInput {
  tenantId: string;
  patientId: string;
  doctorId: string;
  queuedAt?: string;
  isPriority?: boolean;
  notes?: string;
  createdByMemberId: string;
}

interface QueueActionInput {
  tenantId: string;
  queueEntryId: string;
  actorMemberId: string;
  actorRoles: string[];
}

export interface QueueEntryDto {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  queueDate: string;
  queueNumber: number;
  status: QueueEntryStatus;
  isPriority: boolean;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

type PopulatedQueueEntry = {
  _id: { toString: () => string };
  patientId: { _id: { toString: () => string }; firstName?: string; lastName?: string };
  doctorId: { _id: { toString: () => string }; name?: string };
  queueDate: Date;
  queueNumber: number;
  status: QueueEntryStatus;
  isPriority?: boolean;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
};

function normalizeString(value?: string) {
  return value?.trim() || undefined;
}

function startOfDay(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function ensureQueueStatus(value: string): value is QueueEntryStatus {
  return ["WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(value);
}

function parsePositiveInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function toQueueEntryDto(entry: PopulatedQueueEntry): QueueEntryDto {
  const patientName = [entry.patientId?.firstName ?? "", entry.patientId?.lastName ?? ""]
    .join(" ")
    .trim();

  return {
    id: entry._id.toString(),
    patientId: entry.patientId._id.toString(),
    patientName: patientName || "Unknown Patient",
    doctorId: entry.doctorId._id.toString(),
    doctorName: entry.doctorId.name?.trim() || "Unknown Doctor",
    queueDate: entry.queueDate.toISOString(),
    queueNumber: entry.queueNumber,
    status: entry.status,
    isPriority: Boolean(entry.isPriority),
    notes: entry.notes,
    startedAt: entry.startedAt?.toISOString(),
    completedAt: entry.completedAt?.toISOString(),
    createdAt: entry.createdAt?.toISOString() ?? new Date().toISOString()
  };
}

async function ensurePatientAndDoctorActive(tenantId: string, patientId: string, doctorId: string) {
  if (!isValidObjectId(patientId)) {
    throw new HttpError(400, "Invalid patient id");
  }
  if (!isValidObjectId(doctorId)) {
    throw new HttpError(400, "Invalid doctor id");
  }

  const [patient, doctor] = await Promise.all([
    PatientModel.findOne({ _id: patientId, tenantId, status: "ACTIVE" }).select("_id").lean(),
    DoctorModel.findOne({ _id: doctorId, tenantId, status: "ACTIVE" }).select("_id").lean()
  ]);

  if (!patient) {
    throw new HttpError(404, "Patient not found or inactive");
  }
  if (!doctor) {
    throw new HttpError(404, "Doctor not found or inactive");
  }
}

async function ensureDoctorCanOperate(tenantId: string, doctorId: string, actorMemberId: string, actorRoles: string[]) {
  if (actorRoles.includes("ADMIN")) {
    return;
  }

  if (!actorRoles.includes("DOCTOR")) {
    throw new HttpError(403, "Only doctor or admin can perform this action");
  }

  const doctor = await DoctorModel.findOne({ _id: doctorId, tenantId, status: "ACTIVE" })
    .select("memberId")
    .lean();

  if (!doctor) {
    throw new HttpError(404, "Doctor not found");
  }

  if (doctor.memberId.toString() !== actorMemberId) {
    throw new HttpError(403, "Doctor can only update their own queue entries");
  }
}

async function populateEntry(tenantId: string, queueEntryId: string) {
  const entry = await QueueEntryModel.findOne({ _id: queueEntryId, tenantId })
    .populate("patientId", "firstName lastName")
    .populate("doctorId", "name")
    .lean();

  if (!entry) {
    throw new HttpError(404, "Queue entry not found");
  }

  const typed = entry as unknown as PopulatedQueueEntry;

  if (!typed.patientId?._id || !typed.doctorId?._id) {
    throw new HttpError(409, "Queue entry has missing patient or doctor relation");
  }

  return typed;
}

async function getNextQueueNumber(tenantId: string, doctorId: string, queueDate: Date) {
  const latest = await QueueEntryModel.findOne({ tenantId, doctorId, queueDate })
    .sort({ queueNumber: -1 })
    .select("queueNumber")
    .lean();

  return (latest?.queueNumber ?? 0) + 1;
}

export class QueueService {
  static async list(tenantId: string, filters: QueueListFilters = {}) {
    if (filters.status && !ensureQueueStatus(filters.status)) {
      throw new HttpError(400, "Invalid queue status");
    }

    if (filters.doctorId && !isValidObjectId(filters.doctorId)) {
      throw new HttpError(400, "Invalid doctor id");
    }

    const query: {
      tenantId: string;
      queueDate?: Date;
      status?: QueueEntryStatus;
      doctorId?: string;
    } = {
      tenantId
    };

    if (!filters.allDates) {
      query.queueDate = filters.date ? startOfDay(new Date(filters.date)) : startOfDay(new Date());
    }

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.doctorId) {
      query.doctorId = filters.doctorId;
    }

    const entries = await QueueEntryModel.find(query)
      .sort({ queueNumber: 1 })
      .populate("patientId", "firstName lastName")
      .populate("doctorId", "name")
      .lean();

    return entries.map((entry) => {
      const typed = entry as unknown as PopulatedQueueEntry;

      if (!typed.patientId?._id || !typed.doctorId?._id) {
        throw new HttpError(409, "Queue entry has missing patient or doctor relation");
      }

      return toQueueEntryDto(typed);
    });
  }

  static async create(input: CreateQueueEntryInput) {
    await ensurePatientAndDoctorActive(input.tenantId, input.patientId, input.doctorId);
    const settings = await SettingsService.getByTenantId(input.tenantId);

    const sourceDate = input.queuedAt ? new Date(input.queuedAt) : new Date();
    const queueDate = startOfDay(sourceDate);

    const allowPriorityQueueEntries = Boolean(settings?.queue?.allowPriorityQueueEntries);
    if (input.isPriority && !allowPriorityQueueEntries) {
      throw new HttpError(409, "Priority queue entries are disabled by tenant settings");
    }

    const maxQueueSize = parsePositiveInteger(settings?.queue?.maxQueueSize, 100);
    const todaysQueueCount = await QueueEntryModel.countDocuments({
      tenantId: input.tenantId,
      queueDate,
      status: { $ne: "CANCELLED" }
    });
    if (todaysQueueCount >= maxQueueSize) {
      throw new HttpError(409, `Maximum queue size reached (${maxQueueSize})`);
    }

    let attempts = 0;
    while (attempts < 3) {
      attempts += 1;
      const queueNumber = await getNextQueueNumber(input.tenantId, input.doctorId, queueDate);

      try {
        const created = await QueueEntryModel.create({
          tenantId: input.tenantId,
          patientId: input.patientId,
          doctorId: input.doctorId,
          queueDate,
          queueNumber,
          status: "WAITING",
          isPriority: Boolean(input.isPriority),
          notes: normalizeString(input.notes),
          createdByMemberId: input.createdByMemberId
        });

        const populated = await populateEntry(input.tenantId, created._id.toString());
        return toQueueEntryDto(populated);
      } catch (error) {
        const duplicateKey = error as { code?: number };
        if (duplicateKey.code !== 11000) {
          throw error;
        }
      }
    }

    throw new HttpError(409, "Failed to assign queue number. Please retry.");
  }

  static async getById(tenantId: string, queueEntryId: string) {
    if (!isValidObjectId(queueEntryId)) {
      throw new HttpError(400, "Invalid queue entry id");
    }

    const populated = await populateEntry(tenantId, queueEntryId);
    return toQueueEntryDto(populated);
  }

  static async start(input: QueueActionInput) {
    if (!isValidObjectId(input.queueEntryId)) {
      throw new HttpError(400, "Invalid queue entry id");
    }

    const current = await QueueEntryModel.findOne({ _id: input.queueEntryId, tenantId: input.tenantId })
      .select("_id doctorId status")
      .lean();

    if (!current) {
      throw new HttpError(404, "Queue entry not found");
    }

    await ensureDoctorCanOperate(
      input.tenantId,
      current.doctorId.toString(),
      input.actorMemberId,
      input.actorRoles
    );

    if (current.status !== "WAITING") {
      throw new HttpError(409, "Only WAITING entries can be started");
    }

    await QueueEntryModel.findOneAndUpdate(
      { _id: input.queueEntryId, tenantId: input.tenantId, status: "WAITING" },
      {
        status: "IN_PROGRESS",
        startedAt: new Date()
      },
      { returnDocument: "after" }
    ).lean();

    return this.getById(input.tenantId, input.queueEntryId);
  }

  static async complete(input: QueueActionInput) {
    if (!isValidObjectId(input.queueEntryId)) {
      throw new HttpError(400, "Invalid queue entry id");
    }

    const current = await QueueEntryModel.findOne({ _id: input.queueEntryId, tenantId: input.tenantId })
      .select("_id doctorId status")
      .lean();

    if (!current) {
      throw new HttpError(404, "Queue entry not found");
    }

    await ensureDoctorCanOperate(
      input.tenantId,
      current.doctorId.toString(),
      input.actorMemberId,
      input.actorRoles
    );

    if (current.status !== "IN_PROGRESS") {
      throw new HttpError(409, "Only IN_PROGRESS entries can be completed");
    }

    const [settings, latestVisit] = await Promise.all([
      SettingsService.getByTenantId(input.tenantId),
      VisitModel.findOne({
        tenantId: input.tenantId,
        queueEntryId: input.queueEntryId
      })
        .sort({ visitedAt: -1 })
        .select("symptoms diagnosis")
        .lean()
    ]);

    if (!latestVisit) {
      throw new HttpError(409, "Cannot complete consultation without visit details");
    }

    if (settings?.clinical?.symptomsRequired && !latestVisit.symptoms?.trim()) {
      throw new HttpError(409, "Symptoms are required to complete consultation");
    }

    if (settings?.clinical?.diagnosisRequiredToComplete && !latestVisit.diagnosis?.trim()) {
      throw new HttpError(409, "Diagnosis is required to complete consultation");
    }

    await QueueEntryModel.findOneAndUpdate(
      { _id: input.queueEntryId, tenantId: input.tenantId, status: "IN_PROGRESS" },
      {
        status: "COMPLETED",
        completedAt: new Date()
      },
      { returnDocument: "after" }
    ).lean();

    return this.getById(input.tenantId, input.queueEntryId);
  }

  static async cancel(input: QueueActionInput) {
    if (!isValidObjectId(input.queueEntryId)) {
      throw new HttpError(400, "Invalid queue entry id");
    }

    const current = await QueueEntryModel.findOne({ _id: input.queueEntryId, tenantId: input.tenantId })
      .select("_id doctorId status")
      .lean();

    if (!current) {
      throw new HttpError(404, "Queue entry not found");
    }

    if (current.status === "COMPLETED") {
      throw new HttpError(409, "Completed entries cannot be cancelled");
    }

    if (!input.actorRoles.includes("ADMIN") && !input.actorRoles.includes("RECEPTION")) {
      await ensureDoctorCanOperate(
        input.tenantId,
        current.doctorId.toString(),
        input.actorMemberId,
        input.actorRoles
      );
    }

    await QueueEntryModel.findOneAndUpdate(
      { _id: input.queueEntryId, tenantId: input.tenantId },
      {
        status: "CANCELLED"
      },
      { returnDocument: "after" }
    ).lean();

    return this.getById(input.tenantId, input.queueEntryId);
  }
}
