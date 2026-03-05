import { Schema, model } from "mongoose";

export interface Account {
  email: string;
  passwordHash: string;
  name: string;
  status: "ACTIVE" | "DISABLED";
}

const accountSchema = new Schema<Account>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["ACTIVE", "DISABLED"],
      default: "ACTIVE",
      required: true
    }
  },
  { timestamps: true }
);

export const AccountModel = model<Account>("Account", accountSchema);
