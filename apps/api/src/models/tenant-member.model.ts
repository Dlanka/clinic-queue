import { Schema, Types, model } from "mongoose";

export interface TenantMember {
  tenantId: Types.ObjectId;
  accountId: Types.ObjectId;
  roles: string[];
  isActive: boolean;
}

const tenantMemberSchema = new Schema<TenantMember>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    roles: { type: [String], required: true, default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

tenantMemberSchema.index({ tenantId: 1, accountId: 1 }, { unique: true });

export const TenantMemberModel = model<TenantMember>("TenantMember", tenantMemberSchema);
