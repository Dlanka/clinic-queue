import { Schema, model } from "mongoose";

export interface Tenant {
  name: string;
  status: "ACTIVE" | "INACTIVE";
}

const tenantSchema = new Schema<Tenant>(
  {
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      required: true
    }
  },
  { timestamps: true }
);

export const TenantModel = model<Tenant>("Tenant", tenantSchema);
