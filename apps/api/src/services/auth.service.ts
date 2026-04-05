import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { isValidObjectId } from "mongoose";
import type { Types } from "mongoose";
import { AccountModel } from "../models/account.model";
import { AuthSessionModel } from "../models/auth-session.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { TenantModel } from "../models/tenant.model";
import { SettingsService } from "./settings.service";
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

interface UpdateProfileInput {
  name: string;
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

interface UpdatePreferencesInput {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
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

interface AccountSessionSummary {
  sessionId: string;
  lastSeenAt: Date;
  createdAt?: Date;
  revokedAt?: Date;
}

function buildSessionAuth(
  membership: SessionMembership,
  session: { sessionId: string; refreshTokenId: string },
  isSuperAdmin = false
): AuthContext {
  return {
    accountId: membership.accountId.toString(),
    memberId: membership._id.toString(),
    tenantId: membership.tenantId.toString(),
    roles: membership.roles,
    sessionId: session.sessionId,
    refreshTokenId: session.refreshTokenId,
    isSuperAdmin
  };
}

function buildTokens(auth: AuthContext) {
  return {
    accessToken: signAccessToken(auth),
    refreshToken: signRefreshToken(auth)
  };
}

const ACTIVE_SESSION_FILTER = {
  $or: [{ revokedAt: { $exists: false } }, { revokedAt: null }]
};

export class AuthService {
  private static async createSessionAuth(
    membership: SessionMembership,
    isSuperAdmin = false
  ): Promise<AuthContext> {
    const tenantId = membership.tenantId.toString();
    const memberId = membership._id.toString();
    const accountId = membership.accountId.toString();
    const settings = await SettingsService.getByTenantId(tenantId);

    if (!settings.access.allowConcurrentSessions) {
      await AuthSessionModel.updateMany(
        {
          tenantId,
          memberId,
          ...ACTIVE_SESSION_FILTER
        },
        { $set: { revokedAt: new Date() } }
      );
    }

    const sessionId = randomUUID();
    const refreshTokenId = randomUUID();

    await AuthSessionModel.create({
      tenantId,
      memberId,
      accountId,
      sessionId,
      refreshTokenId,
      lastSeenAt: new Date()
    });

    return buildSessionAuth(membership, { sessionId, refreshTokenId }, isSuperAdmin);
  }

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
      const auth = await AuthService.createSessionAuth(membership, account.isSuperAdmin);
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

    const account = await AccountModel.findOne({
      _id: loginPayload.accountId,
      status: "ACTIVE"
    })
      .select("_id isSuperAdmin")
      .lean();

    if (!account) {
      throw new HttpError(401, "Account not found");
    }

    const auth = await AuthService.createSessionAuth(
      membership as SessionMembership,
      Boolean(account.isSuperAdmin)
    );
    return {
      mode: "LOGGED_IN" as const,
      auth,
      tokens: buildTokens(auth)
    };
  }

  static async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const [session, settings] = await Promise.all([
      AuthSessionModel.findOne({
        sessionId: payload.sessionId,
        memberId: payload.memberId,
        accountId: payload.accountId,
        tenantId: payload.tenantId,
        ...ACTIVE_SESSION_FILTER
      }),
      SettingsService.getByTenantId(payload.tenantId)
    ]);

    if (!session) {
      throw new HttpError(401, "Session invalid");
    }

    if (session.refreshTokenId !== payload.refreshTokenId) {
      throw new HttpError(401, "Refresh token invalid");
    }

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

    const shouldRotate = settings.security.rotateSessionOnRefresh;
    const nextRefreshTokenId = shouldRotate ? randomUUID() : session.refreshTokenId;

    session.refreshTokenId = nextRefreshTokenId;
    session.lastSeenAt = new Date();
    await session.save();

    const auth = buildSessionAuth(
      membership as SessionMembership,
      {
        sessionId: session.sessionId,
        refreshTokenId: nextRefreshTokenId
      },
      Boolean(account.isSuperAdmin)
    );
    return {
      auth,
      tokens: buildTokens(auth)
    };
  }

  static async logout(auth: AuthContext) {
    await AuthSessionModel.updateOne(
      {
        sessionId: auth.sessionId,
        memberId: auth.memberId,
        accountId: auth.accountId,
        tenantId: auth.tenantId,
        ...ACTIVE_SESSION_FILTER
      },
      { $set: { revokedAt: new Date() } }
    );

    return { ok: true };
  }

  static async me(auth: AuthContext) {
    const [account, tenant, membership] = await Promise.all([
      AccountModel.findOne({ _id: auth.accountId, status: "ACTIVE" })
        .select("_id email name preferences passwordChangedAt")
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
        name: account.name,
        isSuperAdmin: account.isSuperAdmin ?? false,
        preferences: {
          language: account.preferences?.language ?? "en",
          timezone: account.preferences?.timezone ?? "Asia/Colombo",
          dateFormat: account.preferences?.dateFormat ?? "MMM dd, yyyy",
          timeFormat: account.preferences?.timeFormat ?? "12-hour (AM/PM)",
          emailNotifications: account.preferences?.emailNotifications ?? true,
          inAppNotifications: account.preferences?.inAppNotifications ?? true
        },
        passwordChangedAt: account.passwordChangedAt ?? null
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

  static async updateProfile(auth: AuthContext, input: UpdateProfileInput) {
    const name = input.name.trim();
    const account = await AccountModel.findOne({
      _id: auth.accountId,
      status: "ACTIVE"
    });

    if (!account) {
      throw new HttpError(404, "Account not found");
    }

    account.name = name;
    await account.save();

    return {
      account: {
        id: account._id.toString(),
        email: account.email,
        name: account.name,
        isSuperAdmin: account.isSuperAdmin ?? false,
        preferences: {
          language: account.preferences?.language ?? "en",
          timezone: account.preferences?.timezone ?? "Asia/Colombo",
          dateFormat: account.preferences?.dateFormat ?? "MMM dd, yyyy",
          timeFormat: account.preferences?.timeFormat ?? "12-hour (AM/PM)",
          emailNotifications: account.preferences?.emailNotifications ?? true,
          inAppNotifications: account.preferences?.inAppNotifications ?? true
        },
        passwordChangedAt: account.passwordChangedAt ?? null
      }
    };
  }

  static async updatePreferences(auth: AuthContext, input: UpdatePreferencesInput) {
    const account = await AccountModel.findOne({
      _id: auth.accountId,
      status: "ACTIVE"
    });

    if (!account) {
      throw new HttpError(404, "Account not found");
    }

    account.preferences = {
      language: input.language,
      timezone: input.timezone,
      dateFormat: input.dateFormat,
      timeFormat: input.timeFormat,
      emailNotifications: input.emailNotifications,
      inAppNotifications: input.inAppNotifications
    };
    await account.save();

    return {
      preferences: {
        language: account.preferences.language,
        timezone: account.preferences.timezone,
        dateFormat: account.preferences.dateFormat,
        timeFormat: account.preferences.timeFormat,
        emailNotifications: account.preferences.emailNotifications,
        inAppNotifications: account.preferences.inAppNotifications
      }
    };
  }

  static async listSessions(auth: AuthContext) {
    const sessions = await AuthSessionModel.find({
      tenantId: auth.tenantId,
      accountId: auth.accountId,
      ...ACTIVE_SESSION_FILTER
    })
      .sort({ lastSeenAt: -1 })
      .lean<AccountSessionSummary[]>();

    return sessions.map((session) => ({
      sessionId: session.sessionId,
      lastSeenAt: session.lastSeenAt,
      createdAt: session.createdAt ?? session.lastSeenAt,
      isCurrent: session.sessionId === auth.sessionId
    }));
  }

  static async revokeSession(auth: AuthContext, sessionId: string) {
    await AuthSessionModel.updateOne(
      {
        sessionId,
        tenantId: auth.tenantId,
        accountId: auth.accountId,
        ...ACTIVE_SESSION_FILTER
      },
      { $set: { revokedAt: new Date() } }
    );

    return { ok: true };
  }

  static async revokeOtherSessions(auth: AuthContext) {
    await AuthSessionModel.updateMany(
      {
        tenantId: auth.tenantId,
        accountId: auth.accountId,
        sessionId: { $ne: auth.sessionId },
        ...ACTIVE_SESSION_FILTER
      },
      { $set: { revokedAt: new Date() } }
    );

    return { ok: true };
  }

  static async changePassword(auth: AuthContext, input: ChangePasswordInput) {
    const account = await AccountModel.findOne({
      _id: auth.accountId,
      status: "ACTIVE"
    });

    if (!account) {
      throw new HttpError(404, "Account not found");
    }

    const passwordMatches = await bcrypt.compare(input.currentPassword, account.passwordHash);
    if (!passwordMatches) {
      throw new HttpError(400, "Current password is incorrect");
    }

    const settings = await SettingsService.getByTenantId(auth.tenantId);
    const minPasswordLength = Number.parseInt(settings?.security?.minimumPasswordLength ?? "8", 10);
    const effectiveMinLength =
      Number.isFinite(minPasswordLength) && minPasswordLength > 0 ? minPasswordLength : 8;

    if (input.newPassword.length < effectiveMinLength) {
      throw new HttpError(
        400,
        `New password must be at least ${effectiveMinLength} characters long`
      );
    }

    if (settings?.security?.forceStrongPasswordRule) {
      const hasUpper = /[A-Z]/.test(input.newPassword);
      const hasLower = /[a-z]/.test(input.newPassword);
      const hasDigit = /\d/.test(input.newPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(input.newPassword);

      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        throw new HttpError(
          400,
          "Password must include uppercase, lowercase, number, and special character"
        );
      }
    }

    account.passwordHash = await bcrypt.hash(input.newPassword, 10);
    account.passwordChangedAt = new Date();
    await account.save();

    return { ok: true };
  }
}
