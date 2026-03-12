import { isValidObjectId, type Types } from "mongoose";
import { AccountModel } from "../models/account.model";
import { DoctorModel } from "../models/doctor.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { HttpError } from "../utils/http-error";

interface CreateDoctorInput {
  tenantId: string;
  memberId: string;
  name: string;
  specialization: string;
  licenseNumber?: string;
  status?: "ACTIVE" | "DISABLED";
}

interface UpdateDoctorInput {
  tenantId: string;
  doctorId: string;
  memberId?: string;
  name?: string;
  specialization?: string;
  licenseNumber?: string;
  status?: "ACTIVE" | "DISABLED";
}

export interface DoctorDto {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  name: string;
  specialization: string;
  licenseNumber?: string;
  status: "ACTIVE" | "DISABLED";
}

interface DoctorDocument {
  _id: Types.ObjectId;
  memberId?: Types.ObjectId;
  name: string;
  specialization: string;
  licenseNumber?: string;
  status: "ACTIVE" | "DISABLED";
}

interface MemberContext {
  id: string;
  name: string;
  email: string;
}

async function ensureDoctorMember(tenantId: string, memberId: string) {
  if (!isValidObjectId(memberId)) {
    throw new HttpError(400, "Invalid member id");
  }

  const member = await TenantMemberModel.findOne({
    _id: memberId,
    tenantId,
    status: "ACTIVE",
    roles: "DOCTOR"
  })
    .select("_id")
    .lean();

  if (!member) {
    throw new HttpError(400, "Member must be ACTIVE and include DOCTOR role");
  }
}

async function ensureMemberNotLinkedToAnotherDoctor(
  tenantId: string,
  memberId: string,
  excludeDoctorId?: string
) {
  const filter = excludeDoctorId
    ? { tenantId, memberId, _id: { $ne: excludeDoctorId } }
    : { tenantId, memberId };

  const existing = await DoctorModel.findOne(filter).select("_id").lean();
  if (existing) {
    throw new HttpError(409, "This member already has a doctor profile");
  }
}

async function getMemberContexts(tenantId: string, doctors: DoctorDocument[]) {
  const memberIds = [
    ...new Set(
      doctors
        .map((doctor) => doctor.memberId?.toString())
        .filter((memberId): memberId is string => Boolean(memberId) && isValidObjectId(memberId))
    )
  ];
  if (memberIds.length === 0) {
    return new Map<string, MemberContext>();
  }

  const memberships = await TenantMemberModel.find({
    _id: { $in: memberIds },
    tenantId
  })
    .select("_id accountId")
    .lean();

  const accountIds = memberships
    .map((member) => member.accountId?.toString())
    .filter((accountId): accountId is string => Boolean(accountId) && isValidObjectId(accountId));

  if (accountIds.length === 0) {
    return new Map<string, MemberContext>();
  }
  const accounts = await AccountModel.find({
    _id: { $in: accountIds },
    status: "ACTIVE"
  })
    .select("_id name email")
    .lean();

  const accountById = new Map(accounts.map((account) => [account._id.toString(), account]));
  const contextByMemberId = new Map<string, MemberContext>();

  for (const membership of memberships) {
    const account = accountById.get(membership.accountId.toString());
    if (!account) {
      continue;
    }

    contextByMemberId.set(membership._id.toString(), {
      id: membership._id.toString(),
      name: account.name,
      email: account.email
    });
  }

  return contextByMemberId;
}

function toDoctorDto(doctor: DoctorDocument, member: MemberContext): DoctorDto {
  return {
    id: doctor._id.toString(),
    memberId: member.id,
    memberName: member.name,
    memberEmail: member.email,
    name: doctor.name,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    status: doctor.status
  };
}

export class DoctorService {
  static async list(tenantId: string) {
    const doctors = await DoctorModel.find({ tenantId }).sort({ createdAt: -1 }).lean();
    const members = await getMemberContexts(tenantId, doctors);

    return doctors
      .map((doctor) => {
        if (!doctor.memberId) {
          return null;
        }

        const member = members.get(doctor.memberId.toString());
        if (!member) {
          return null;
        }
        return toDoctorDto(doctor, member);
      })
      .filter((doctor): doctor is DoctorDto => doctor !== null);
  }

  static async create(input: CreateDoctorInput) {
    await ensureDoctorMember(input.tenantId, input.memberId);
    await ensureMemberNotLinkedToAnotherDoctor(input.tenantId, input.memberId);

    const doctor = await DoctorModel.create({
      tenantId: input.tenantId,
      memberId: input.memberId,
      name: input.name.trim(),
      specialization: input.specialization.trim(),
      licenseNumber: input.licenseNumber?.trim() || undefined,
      status: input.status ?? "ACTIVE"
    });

    const members = await getMemberContexts(input.tenantId, [
      {
        _id: doctor._id,
        memberId: doctor.memberId,
        name: doctor.name,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        status: doctor.status
      }
    ]);
    const member = members.get(doctor.memberId.toString());

    if (!member) {
      throw new HttpError(404, "Member account not found");
    }

    return toDoctorDto(
      {
        _id: doctor._id,
        memberId: doctor.memberId,
        name: doctor.name,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        status: doctor.status
      },
      member
    );
  }

  static async getById(tenantId: string, doctorId: string) {
    if (!isValidObjectId(doctorId)) {
      throw new HttpError(400, "Invalid doctor id");
    }

    const doctor = await DoctorModel.findOne({ _id: doctorId, tenantId }).lean();
    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }
    if (!doctor.memberId) {
      throw new HttpError(409, "Doctor profile is missing linked member");
    }

    const members = await getMemberContexts(tenantId, [doctor]);
    const member = members.get(doctor.memberId.toString());

    if (!member) {
      throw new HttpError(404, "Member account not found");
    }

    return toDoctorDto(doctor, member);
  }

  static async update(input: UpdateDoctorInput) {
    if (!isValidObjectId(input.doctorId)) {
      throw new HttpError(400, "Invalid doctor id");
    }

    const updatePayload: {
      memberId?: string;
      name?: string;
      specialization?: string;
      licenseNumber?: string;
      status?: "ACTIVE" | "DISABLED";
    } = {};

    if (input.memberId !== undefined) {
      await ensureDoctorMember(input.tenantId, input.memberId);
      await ensureMemberNotLinkedToAnotherDoctor(input.tenantId, input.memberId, input.doctorId);
      updatePayload.memberId = input.memberId;
    }

    if (input.name !== undefined) {
      updatePayload.name = input.name.trim();
    }
    if (input.specialization !== undefined) {
      updatePayload.specialization = input.specialization.trim();
    }
    if (input.licenseNumber !== undefined) {
      updatePayload.licenseNumber = input.licenseNumber.trim() || undefined;
    }
    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }

    const doctor = await DoctorModel.findOneAndUpdate(
      { _id: input.doctorId, tenantId: input.tenantId },
      updatePayload,
      { returnDocument: "after" }
    ).lean();

    if (!doctor) {
      throw new HttpError(404, "Doctor not found");
    }
    if (!doctor.memberId) {
      throw new HttpError(409, "Doctor profile is missing linked member");
    }

    const members = await getMemberContexts(input.tenantId, [doctor]);
    const member = members.get(doctor.memberId.toString());

    if (!member) {
      throw new HttpError(404, "Member account not found");
    }

    return toDoctorDto(doctor, member);
  }

  static async remove(tenantId: string, doctorId: string) {
    if (!isValidObjectId(doctorId)) {
      throw new HttpError(400, "Invalid doctor id");
    }

    const deleted = await DoctorModel.findOneAndDelete({ _id: doctorId, tenantId }).lean();
    if (!deleted) {
      throw new HttpError(404, "Doctor not found");
    }
  }
}
