import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { APP_ROLES } from "../constants/roles";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel, type Tenant } from "../models/tenant.model";
import { HttpError } from "../utils/http-error";

type TenantStatus = Tenant["status"];

interface ListTenantsInput {
  search?: string;
  status?: TenantStatus;
}

interface CreateTenantInput {
  name: string;
  adminEmail: string;
  adminName?: string;
  adminPassword: string;
  adminRoles?: string[];
}

interface UpdateTenantInput {
  tenantId: string;
  name?: string;
  status?: TenantStatus;
}

function normalizeRoles(roles?: string[]) {
  const nextRoles = roles && roles.length > 0 ? roles : ["ADMIN"];
  const uniqueRoles = [...new Set(nextRoles.map((role) => role.trim().toUpperCase()))];

  for (const role of uniqueRoles) {
    if (!APP_ROLES.includes(role as (typeof APP_ROLES)[number])) {
      throw new HttpError(400, `Invalid role: ${role}`);
    }
  }

  return uniqueRoles;
}

function toTenantDto(
  tenant: { _id: { toString(): string }; name: string; status: TenantStatus },
  memberCount = 0
) {
  return {
    id: tenant._id.toString(),
    name: tenant.name,
    status: tenant.status,
    memberCount
  };
}

export class AdminTenantService {
  static async list(input: ListTenantsInput) {
    const filter: {
      status?: TenantStatus;
      name?: { $regex: string; $options: "i" };
    } = {};

    if (input.status) {
      filter.status = input.status;
    }

    if (input.search?.trim()) {
      filter.name = { $regex: input.search.trim(), $options: "i" };
    }

    const tenants = await TenantModel.find(filter).sort({ createdAt: -1 }).lean();
    if (tenants.length === 0) {
      return [];
    }

    const counts = await TenantMemberModel.aggregate<{ _id: unknown; count: number }>([
      { $match: { tenantId: { $in: tenants.map((tenant) => tenant._id) } } },
      { $group: { _id: "$tenantId", count: { $sum: 1 } } }
    ]);

    const countByTenantId = new Map(
      counts.map((entry) => [String(entry._id), entry.count])
    );

    return tenants.map((tenant) =>
      toTenantDto(tenant, countByTenantId.get(tenant._id.toString()) ?? 0)
    );
  }

  static async create(input: CreateTenantInput) {
    const tenantName = input.name.trim();
    const adminEmail = input.adminEmail.toLowerCase().trim();
    const adminName = input.adminName?.trim() || adminEmail.split("@")[0] || "Tenant Admin";
    const roles = normalizeRoles(input.adminRoles);

    const existingTenant = await TenantModel.findOne({ name: tenantName }).lean();
    if (existingTenant) {
      throw new HttpError(409, "Tenant name already exists");
    }

    const tenant = await TenantModel.create({
      name: tenantName,
      status: "ACTIVE"
    });

    let account = await AccountModel.findOne({ email: adminEmail });
    if (!account) {
      const passwordHash = await bcrypt.hash(input.adminPassword, 12);
      account = await AccountModel.create({
        email: adminEmail,
        name: adminName,
        passwordHash,
        status: "ACTIVE"
      });
    }

    const existingMember = await TenantMemberModel.findOne({
      tenantId: tenant._id,
      accountId: account._id
    }).lean();

    if (existingMember) {
      throw new HttpError(409, "Admin user is already a member of this tenant");
    }

    await TenantMemberModel.create({
      tenantId: tenant._id,
      accountId: account._id,
      roles,
      status: "ACTIVE"
    });

    return toTenantDto(tenant.toObject(), 1);
  }

  static async update(input: UpdateTenantInput) {
    if (!isValidObjectId(input.tenantId)) {
      throw new HttpError(400, "Invalid tenant id");
    }

    const updatePayload: { name?: string; status?: TenantStatus } = {};
    if (input.name !== undefined) {
      updatePayload.name = input.name.trim();
    }

    if (input.status !== undefined) {
      updatePayload.status = input.status;
    }

    const tenant = await TenantModel.findByIdAndUpdate(input.tenantId, updatePayload, {
      returnDocument: "after"
    }).lean();

    if (!tenant) {
      throw new HttpError(404, "Tenant not found");
    }

    const memberCount = await TenantMemberModel.countDocuments({ tenantId: tenant._id });
    return toTenantDto(tenant, memberCount);
  }
}
