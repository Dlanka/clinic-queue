import { Schema, model } from "mongoose";

export interface Account {
  email: string;
  passwordHash: string;
  name: string;
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    emailNotifications: boolean;
    inAppNotifications: boolean;
  };
  passwordChangedAt?: Date;
  status: "ACTIVE" | "DISABLED";
  isSuperAdmin: boolean;
}

const accountSchema = new Schema<Account>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    preferences: {
      language: { type: String, default: "en" },
      timezone: { type: String, default: "Asia/Colombo" },
      dateFormat: { type: String, default: "MMM dd, yyyy" },
      timeFormat: { type: String, default: "12-hour (AM/PM)" },
      emailNotifications: { type: Boolean, default: true },
      inAppNotifications: { type: Boolean, default: true }
    },
    passwordChangedAt: { type: Date, default: () => new Date() },
    isSuperAdmin: { type: Boolean, default: false },
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
