import { Schema, Types, model } from "mongoose";

export interface GeneralSettings {
  clinicName: string;
  contactNumber: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

export interface AccessSettings {
  doctorLandingConsultation: boolean;
  enforceRoleMatrix: boolean;
  allowConcurrentSessions: boolean;
  sessionTimeoutMinutes: string;
  maxLoginAttempts: string;
}

export interface QueueSettings {
  queuePrefix: string;
  queueNumberDigits: string;
  autoRefreshSeconds: string;
  maxQueueSize: string;
  allowPriorityQueueEntries: boolean;
  defaultFilterToToday: boolean;
  showWaitTimeEstimates: boolean;
}

export interface ClinicalSettings {
  symptomsRequired: boolean;
  diagnosisRequiredToComplete: boolean;
  lockConsultationAfterCompletion: boolean;
  enableVitalWarnings: boolean;
  editWindowAfterCompletionHours: string;
  vitalsWarningThreshold: string;
}

export interface PharmacySettings {
  defaultLowStockThreshold: string;
  thermalPrintTemplate: string;
  printEnabledByDefaultOnDispense: boolean;
  allowEditBeforeDispense: boolean;
  allowEditAfterDispense: boolean;
}

export interface SecuritySettings {
  minimumPasswordLength: string;
  tokenRotationPolicy: string;
  forceStrongPasswordRule: boolean;
  rotateSessionOnRefresh: boolean;
  showAuditTrailInAdminPages: boolean;
}

export interface SystemSettings {
  dashboardRefreshSeconds: string;
  defaultTheme: string;
  enableSoftDeleteBehavior: boolean;
  allowAppointmentDoubleBooking: boolean;
  systemNotes: string;
}

export interface TenantSettings {
  tenantId: Types.ObjectId;
  general: GeneralSettings;
  access: AccessSettings;
  queue: QueueSettings;
  clinical: ClinicalSettings;
  pharmacy: PharmacySettings;
  security: SecuritySettings;
  system: SystemSettings;
}

const settingsSchema = new Schema<TenantSettings>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true, unique: true, index: true },
    general: {
      clinicName: { type: String, default: "Clinic" },
      contactNumber: { type: String, default: "" },
      timezone: { type: String, default: "Asia/Colombo" },
      currency: { type: String, default: "LKR - Sri Lankan Rupee" },
      dateFormat: { type: String, default: "MMM dd, yyyy" },
      timeFormat: { type: String, default: "12-hour (AM/PM)" }
    },
    access: {
      doctorLandingConsultation: { type: Boolean, default: true },
      enforceRoleMatrix: { type: Boolean, default: true },
      allowConcurrentSessions: { type: Boolean, default: true },
      sessionTimeoutMinutes: { type: String, default: "60" },
      maxLoginAttempts: { type: String, default: "5" }
    },
    queue: {
      queuePrefix: { type: String, default: "Q-" },
      queueNumberDigits: { type: String, default: "3" },
      autoRefreshSeconds: { type: String, default: "20" },
      maxQueueSize: { type: String, default: "100" },
      allowPriorityQueueEntries: { type: Boolean, default: true },
      defaultFilterToToday: { type: Boolean, default: true },
      showWaitTimeEstimates: { type: Boolean, default: false }
    },
    clinical: {
      symptomsRequired: { type: Boolean, default: true },
      diagnosisRequiredToComplete: { type: Boolean, default: true },
      lockConsultationAfterCompletion: { type: Boolean, default: true },
      enableVitalWarnings: { type: Boolean, default: true },
      editWindowAfterCompletionHours: { type: String, default: "24" },
      vitalsWarningThreshold: { type: String, default: "Standard clinical ranges" }
    },
    pharmacy: {
      defaultLowStockThreshold: { type: String, default: "20" },
      thermalPrintTemplate: { type: String, default: "80mm - Standard thermal" },
      printEnabledByDefaultOnDispense: { type: Boolean, default: false },
      allowEditBeforeDispense: { type: Boolean, default: true },
      allowEditAfterDispense: { type: Boolean, default: false }
    },
    security: {
      minimumPasswordLength: { type: String, default: "8" },
      tokenRotationPolicy: { type: String, default: "Cookie refresh token rotation" },
      forceStrongPasswordRule: { type: Boolean, default: true },
      rotateSessionOnRefresh: { type: Boolean, default: true },
      showAuditTrailInAdminPages: { type: Boolean, default: true }
    },
    system: {
      dashboardRefreshSeconds: { type: String, default: "30" },
      defaultTheme: { type: String, default: "Dark" },
      enableSoftDeleteBehavior: { type: Boolean, default: true },
      allowAppointmentDoubleBooking: { type: Boolean, default: false },
      systemNotes: {
        type: String,
        default: "Basic settings page is active. Backend persistence can be connected once API endpoints are finalized."
      }
    }
  },
  { timestamps: true }
);

export const SettingsModel = model<TenantSettings>("Settings", settingsSchema);

