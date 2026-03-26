import { Schema, Types, model } from "mongoose";

export interface AuthSession {
  tenantId: Types.ObjectId;
  memberId: Types.ObjectId;
  accountId: Types.ObjectId;
  sessionId: string;
  refreshTokenId: string;
  revokedAt?: Date;
  lastSeenAt: Date;
}

const authSessionSchema = new Schema<AuthSession>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    memberId: { type: Schema.Types.ObjectId, ref: "TenantMember", required: true, index: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    sessionId: { type: String, required: true, unique: true, index: true },
    refreshTokenId: { type: String, required: true },
    revokedAt: { type: Date },
    lastSeenAt: { type: Date, required: true, default: () => new Date() }
  },
  { timestamps: true }
);

authSessionSchema.index({ tenantId: 1, memberId: 1, revokedAt: 1 });

export const AuthSessionModel = model<AuthSession>("AuthSession", authSessionSchema);

