import { Schema, model } from "mongoose";

export interface Tenant {
  name: string;
  slug: string;
}

const tenantSchema = new Schema<Tenant>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

export const TenantModel = model<Tenant>("Tenant", tenantSchema);
