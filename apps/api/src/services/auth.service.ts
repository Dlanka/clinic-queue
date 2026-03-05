import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import type { Types } from "mongoose";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel } from "../models/tenant.model";
import type { AuthContext } from "../types/auth";
import { HttpError } from "../utils/http-error";
import {
  signAccessToken,
  signLoginToken,
  signRefreshToken,
  verifyLoginToken,
  verifyRefreshToken
} from "../utils/jwt";

interface LoginInput {
  email: string;
  password: string;
}

interface SelectTenantInput {
  loginToken: string;
  tenantId: string;
}

type LoginResult =
  | {
      mode: "LOGGED_IN";
      auth: AuthContext;
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      mode: "SELECT_TENANT";
      loginToken: string;
      tenants: Array<{
        tenantId: string;
        tenantName: string;
      }>;
    };

interface SessionMembership {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  accountId: Types.ObjectId;
  roles: string[];
}

function buildSessionAuth(membership: SessionMembership): AuthContext {
  return {
    accountId: membership.accountId.toString(),
    memberId: membership._id.toString(),
    tenantId: membership.tenantId.toString(),
    roles: membership.roles
  };
}

function buildTokens(auth: AuthContext) {
  return {
    accessToken: signAccessToken(auth),
    refreshToken: signRefreshToken(auth)
  };
}

export class AuthService {
  static async login(input: LoginInput): Promise<LoginResult> {
    const email = input.email.toLowerCase().trim();
    const account = await AccountModel.findOne({ email, status: "ACTIVE" });

    if (!account) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(input.password, account.passwordHash);
    if (!passwordMatches) {
      throw new HttpError(401, "Invalid credentials");
    }

    const memberships = await TenantMemberModel.find({
      accountId: account._id,
      status: "ACTIVE"
    })
      .sort({ createdAt: 1 })
      .lean();

    if (memberships.length === 0) {
      throw new HttpError(403, "No active tenant memberships");
    }

    if (memberships.length === 1) {
      const membership = memberships[0] as SessionMembership | undefined;
      if (!membership) {
        throw new HttpError(403, "No active tenant memberships");
      }
      const auth = buildSessionAuth(membership);
      return {
        mode: "LOGGED_IN",
        auth,
        tokens: buildTokens(auth)
      };
    }

    const tenantIds = memberships.map((membership) => membership.tenantId.toString());
    const tenants = await TenantModel.find({
      _id: { $in: tenantIds },
      status: "ACTIVE"
    })
      .select("_id name")
      .lean();

    const tenantNameMap = new Map(tenants.map((tenant) => [tenant._id.toString(), tenant.name]));
    const loginToken = signLoginToken({
      accountId: account._id.toString(),
      allowedTenantIds: tenantIds
    });

    return {
      mode: "SELECT_TENANT",
      loginToken,
      tenants: tenantIds.map((tenantId) => ({
        tenantId,
        tenantName: tenantNameMap.get(tenantId) ?? "Unknown Tenant"
      }))
    };
  }

  static async selectTenant(input: SelectTenantInput) {
    if (!isValidObjectId(input.tenantId)) {
      throw new HttpError(400, "Invalid tenant id");
    }

    const loginPayload = verifyLoginToken(input.loginToken);

    if (!loginPayload.allowedTenantIds.includes(input.tenantId)) {
      throw new HttpError(403, "Tenant selection not allowed");
    }

    const membership = await TenantMemberModel.findOne({
      tenantId: input.tenantId,
      accountId: loginPayload.accountId,
      status: "ACTIVE"
    }).lean();

    if (!membership) {
      throw new HttpError(403, "No active membership for selected tenant");
    }

    const auth = buildSessionAuth(membership as SessionMembership);
    return {
      mode: "LOGGED_IN" as const,
      auth,
      tokens: buildTokens(auth)
    };
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const [account, membership, tenant] = await Promise.all([
      AccountModel.findOne({ _id: payload.accountId, status: "ACTIVE" }).lean(),
      TenantMemberModel.findOne({
        _id: payload.memberId,
        accountId: payload.accountId,
        tenantId: payload.tenantId,
        status: "ACTIVE"
      }).lean(),
      TenantModel.findOne({ _id: payload.tenantId, status: "ACTIVE" }).lean()
    ]);

    if (!account || !membership || !tenant) {
      throw new HttpError(401, "Refresh denied");
    }

    const auth = buildSessionAuth(membership as SessionMembership);
    return {
      auth,
      tokens: buildTokens(auth)
    };
  }

  static async me(auth: AuthContext) {
    const [account, tenant, membership] = await Promise.all([
      AccountModel.findOne({ _id: auth.accountId, status: "ACTIVE" })
        .select("_id email name")
        .lean(),
      TenantModel.findOne({ _id: auth.tenantId, status: "ACTIVE" }).select("_id name").lean(),
      TenantMemberModel.findOne({
        _id: auth.memberId,
        tenantId: auth.tenantId,
        accountId: auth.accountId,
        status: "ACTIVE"
      })
        .select("_id roles")
        .lean()
    ]);

    if (!account || !tenant || !membership) {
      throw new HttpError(401, "Session invalid");
    }

    return {
      account: {
        id: account._id.toString(),
        email: account.email,
        name: account.name
      },
      tenant: {
        id: tenant._id.toString(),
        name: tenant.name
      },
      member: {
        id: membership._id.toString(),
        roles: membership.roles
      }
    };
  }
}
