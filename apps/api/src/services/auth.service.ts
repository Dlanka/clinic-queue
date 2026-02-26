import bcrypt from "bcryptjs";
import { AccountModel } from "../models/account.model";
import { TenantMemberModel } from "../models/tenant-member.model";
import { HttpError } from "../utils/http-error";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import type { AuthContext } from "../types/auth";

interface LoginInput {
  tenantId: string;
  email: string;
  password: string;
}

export class AuthService {
  static async login(input: LoginInput) {
    const email = input.email.toLowerCase().trim();

    const account = await AccountModel.findOne({ email, isActive: true });
    if (!account) {
      throw new HttpError(401, "Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(input.password, account.passwordHash);
    if (!passwordMatches) {
      throw new HttpError(401, "Invalid credentials");
    }

    const membership = await TenantMemberModel.findOne({
      tenantId: input.tenantId,
      accountId: account._id,
      isActive: true
    });

    if (!membership) {
      throw new HttpError(403, "No tenant membership");
    }

    const auth: AuthContext = {
      accountId: account._id.toString(),
      tenantId: input.tenantId,
      roles: membership.roles
    };

    return {
      user: { id: account._id.toString(), email: account.email, name: account.name, roles: membership.roles },
      auth,
      tokens: {
        accessToken: signAccessToken(auth),
        refreshToken: signRefreshToken(auth)
      }
    };
  }

  static async refresh(tenantId: string, refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    if (payload.tenantId !== tenantId) {
      throw new HttpError(403, "Tenant mismatch");
    }

    const [account, membership] = await Promise.all([
      AccountModel.findOne({ _id: payload.accountId, isActive: true }),
      TenantMemberModel.findOne({
        tenantId,
        accountId: payload.accountId,
        isActive: true
      })
    ]);

    if (!account || !membership) {
      throw new HttpError(401, "Refresh denied");
    }

    const auth: AuthContext = {
      accountId: account._id.toString(),
      tenantId,
      roles: membership.roles
    };

    return {
      user: { id: account._id.toString(), email: account.email, name: account.name, roles: membership.roles },
      auth,
      tokens: {
        accessToken: signAccessToken(auth),
        refreshToken: signRefreshToken(auth)
      }
    };
  }

  static async me(auth: AuthContext) {
    const account = await AccountModel.findOne({ _id: auth.accountId, isActive: true }).lean();
    const membership = await TenantMemberModel.findOne({
      tenantId: auth.tenantId,
      accountId: auth.accountId,
      isActive: true
    }).lean();

    if (!account || !membership) {
      throw new HttpError(404, "User not found");
    }

    return {
      id: account._id.toString(),
      email: account.email,
      name: account.name,
      roles: membership.roles,
      tenantId: auth.tenantId
    };
  }
}
