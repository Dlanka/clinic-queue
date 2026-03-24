import bcrypt from "bcryptjs";
import { isValidObjectId, type Types } from "mongoose";
import { APP_ROLES } from "../constants/roles";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { HttpError } from "../utils/http-error";

interface CreateMemberInput {
  tenantId: string;
  email: string;
  name?: string;
  roles: string[];
  isActive?: boolean;
}

interface UpdateMemberInput {
  tenantId: string;
  memberId: string;
  roles?: string[];
  isActive?: boolean;
}

export interface MemberDto {
  id: string;
  accountId: string;
  email: string;
  name: string;
  roles: string[];
  status: "ACTIVE" | "INVITED" | "DISABLED";
}

export interface MemberWithPasswordDto {
  member: MemberDto;
  temporaryPassword?: string;
}

function generateTemporaryPassword() {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timestampPart = Date.now().toString(36).slice(-4);
  return `Tmp!${randomPart}${timestampPart}`;
}

function normalizeRoles(roles: string[]) {
  const uniqueRoles = [...new Set(roles.map((role) => role.trim().toUpperCase()))];

  for (const role of uniqueRoles) {
    if (!APP_ROLES.includes(role as (typeof APP_ROLES)[number])) {
      throw new HttpError(400, `Invalid role: ${role}`);
    }
  }

  return uniqueRoles;
}

function toMemberDto(
  membership: {
    _id: Types.ObjectId;
    accountId: Types.ObjectId;
    roles: string[];
    status: "ACTIVE" | "INVITED" | "DISABLED";
  },
  account: {
    _id: Types.ObjectId;
    email: string;
    name: string;
  }
): MemberDto {
  return {
    id: membership._id.toString(),
    accountId: membership.accountId.toString(),
    email: account.email,
    name: account.name,
    roles: membership.roles,
    status: membership.status
  };
}

async function buildMemberDtoByMembership(
  membership: {
    _id: Types.ObjectId;
    accountId: Types.ObjectId;
    roles: string[];
    status: "ACTIVE" | "INVITED" | "DISABLED";
  } | null
) {
  if (!membership) {
    throw new HttpError(404, "Member not found");
  }

  const account = await AccountModel.findOne({
    _id: membership.accountId,
    status: "ACTIVE"
  })
    .select("_id email name")
    .lean();

  if (!account) {
    throw new HttpError(404, "Account not found");
  }

  return toMemberDto(membership, account);
}

export class MemberService {
  static async list(tenantId: string) {
    const memberships = await TenantMemberModel.find({ tenantId })
      .select("_id accountId roles status")
      .sort({ createdAt: -1 })
      .lean();

    if (memberships.length === 0) {
      return [];
    }

    const accountIds = memberships.map((membership) => membership.accountId);
    const accounts = await AccountModel.find({
      _id: { $in: accountIds },
      status: "ACTIVE"
    })
      .select("_id email name")
      .lean();

    const accountById = new Map(accounts.map((account) => [account._id.toString(), account]));

    return memberships
      .map((membership) => {
        const account = accountById.get(membership.accountId.toString());
        if (!account) {
          return null;
        }
        return toMemberDto(membership, account);
      })
      .filter((item): item is MemberDto => Boolean(item));
  }

  static async create(input: CreateMemberInput): Promise<MemberWithPasswordDto> {
    const email = input.email.toLowerCase().trim();
    const roles = normalizeRoles(input.roles);

    let account = await AccountModel.findOne({ email, status: "ACTIVE" });

    let temporaryPassword: string | undefined;

    if (!account) {
      temporaryPassword = generateTemporaryPassword();
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      account = await AccountModel.create({
        email,
        name: input.name?.trim() || email.split("@")[0] || "New Member",
        passwordHash,
        status: "ACTIVE"
      });
    }

    const existingMembership = await TenantMemberModel.findOne({
      tenantId: input.tenantId,
      accountId: account._id
    }).lean();

    if (existingMembership) {
      throw new HttpError(409, "Account is already a member of this tenant");
    }

    const membership = await TenantMemberModel.create({
      tenantId: input.tenantId,
      accountId: account._id,
      roles,
      status: input.isActive === false ? "DISABLED" : "ACTIVE"
    });

    const member = await buildMemberDtoByMembership({
      _id: membership._id,
      accountId: membership.accountId,
      roles: membership.roles,
      status: membership.status
    });

    return { member, temporaryPassword };
  }

  static async getById(tenantId: string, memberId: string) {
    if (!isValidObjectId(memberId)) {
      throw new HttpError(400, "Invalid member id");
    }

    const membership = await TenantMemberModel.findOne({
      _id: memberId,
      tenantId
    })
      .select("_id accountId roles status")
      .lean();

    return buildMemberDtoByMembership(membership);
  }

  static async update(input: UpdateMemberInput) {
    const updatePayload: { roles?: string[]; status?: "ACTIVE" | "DISABLED" } = {};

    if (input.roles) {
      updatePayload.roles = normalizeRoles(input.roles);
    }

    if (typeof input.isActive === "boolean") {
      updatePayload.status = input.isActive ? "ACTIVE" : "DISABLED";
    }

    const membership = await TenantMemberModel.findOneAndUpdate(
      {
        _id: input.memberId,
        tenantId: input.tenantId
      },
      updatePayload,
      { new: true }
    )
      .select("_id accountId roles status")
      .lean();

    return buildMemberDtoByMembership(membership);
  }

  static async remove(tenantId: string, memberId: string) {
    const deleted = await TenantMemberModel.findOneAndDelete({
      _id: memberId,
      tenantId
    }).lean();

    if (!deleted) {
      throw new HttpError(404, "Member not found");
    }
  }

  static async resetPassword(tenantId: string, memberId: string): Promise<MemberWithPasswordDto> {
    if (!isValidObjectId(memberId)) {
      throw new HttpError(400, "Invalid member id");
    }

    const membership = await TenantMemberModel.findOne({
      _id: memberId,
      tenantId
    })
      .select("_id accountId roles status")
      .lean();

    if (!membership) {
      throw new HttpError(404, "Member not found");
    }

    const account = await AccountModel.findOne({
      _id: membership.accountId,
      status: "ACTIVE"
    }).select("_id");

    if (!account) {
      throw new HttpError(404, "Account not found");
    }

    const temporaryPassword = generateTemporaryPassword();
    account.passwordHash = await bcrypt.hash(temporaryPassword, 10);
    await account.save();

    const member = await buildMemberDtoByMembership(membership);
    return { member, temporaryPassword };
  }
}
