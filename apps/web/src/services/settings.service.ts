import { http } from "./http";

export interface GeneralSettingsPayload {
  clinicName: string;
  contactNumber: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

export interface AccessSettingsPayload {
  doctorLandingConsultation: boolean;
  enforceRoleMatrix: boolean;
  allowConcurrentSessions: boolean;
  sessionTimeoutMinutes: string;
  maxLoginAttempts: string;
}

export interface QueueSettingsPayload {
  queuePrefix: string;
  queueNumberDigits: string;
  autoRefreshSeconds: string;
  maxQueueSize: string;
  allowPriorityQueueEntries: boolean;
  defaultFilterToToday: boolean;
  showWaitTimeEstimates: boolean;
}

export interface ClinicalSettingsPayload {
  symptomsRequired: boolean;
  diagnosisRequiredToComplete: boolean;
  lockConsultationAfterCompletion: boolean;
  enableVitalWarnings: boolean;
  editWindowAfterCompletionHours: string;
  vitalsWarningThreshold: string;
}

export interface PharmacySettingsPayload {
  defaultLowStockThreshold: string;
  thermalPrintTemplate: string;
  printEnabledByDefaultOnDispense: boolean;
  allowEditBeforeDispense: boolean;
  allowEditAfterDispense: boolean;
}

export interface SecuritySettingsPayload {
  minimumPasswordLength: string;
  tokenRotationPolicy: string;
  forceStrongPasswordRule: boolean;
  rotateSessionOnRefresh: boolean;
  showAuditTrailInAdminPages: boolean;
}

export interface SystemSettingsPayload {
  dashboardRefreshSeconds: string;
  defaultTheme: string;
  enableSoftDeleteBehavior: boolean;
  allowAppointmentDoubleBooking: boolean;
  systemNotes: string;
}

export interface TenantSettingsPayload {
  general: GeneralSettingsPayload;
  access: AccessSettingsPayload;
  queue: QueueSettingsPayload;
  clinical: ClinicalSettingsPayload;
  pharmacy: PharmacySettingsPayload;
  security: SecuritySettingsPayload;
  system: SystemSettingsPayload;
}

export type TenantSettingsPatchPayload = Partial<TenantSettingsPayload>;

export class SettingsService {
  static async get() {
    const { data } = await http.get<{ settings: TenantSettingsPayload }>("/settings");
    return data.settings;
  }

  static async update(payload: TenantSettingsPatchPayload) {
    const { data } = await http.patch<{ settings: TenantSettingsPayload }>("/settings", payload);
    return data.settings;
  }
}

