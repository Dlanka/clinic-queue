import { Schema, Types, model } from "mongoose";

export interface TenantMember {
  tenantId: Types.ObjectId;
  accountId: Types.ObjectId;
  roles: string[];
  status: "ACTIVE" | "INVITED" | "DISABLED";
}

const tenantMemberSchema = new Schema<TenantMember>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    roles: { type: [String], required: true, default: [] },
    status: {
      type: String,
      enum: ["ACTIVE", "INVITED", "DISABLED"],
      default: "ACTIVE",
      required: true
    }
  },
  { timestamps: true }
);

tenantMemberSchema.index({ tenantId: 1, accountId: 1 }, { unique: true });

export const TenantMemberModel = model<TenantMember>("TenantMember", tenantMemberSchema);
