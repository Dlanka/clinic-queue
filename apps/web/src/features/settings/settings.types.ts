import type { iconMap } from "@/config/icons";

export type SettingsTab =
  | "general"
  | "access"
  | "queue"
  | "clinical"
  | "pharmacy"
  | "security"
  | "system";

export type SettingsNavItem = {
  value: SettingsTab;
  label: string;
  subtitle?: string;
  iconName: keyof typeof iconMap;
};

export type GeneralSettingsState = {
  clinicName: string;
  contactNumber: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
};

export type AccessSettingsState = {
  doctorLandingConsultation: boolean;
  enforceRoleMatrix: boolean;
  allowConcurrentSessions: boolean;
  sessionTimeoutMinutes: string;
  maxLoginAttempts: string;
};

export type QueueSettingsState = {
  queuePrefix: string;
  queueNumberDigits: string;
  autoRefreshSeconds: string;
  maxQueueSize: string;
  allowPriorityQueueEntries: boolean;
  defaultFilterToToday: boolean;
  showWaitTimeEstimates: boolean;
};

export type ClinicalSettingsState = {
  symptomsRequired: boolean;
  diagnosisRequiredToComplete: boolean;
  lockConsultationAfterCompletion: boolean;
  enableVitalWarnings: boolean;
  editWindowAfterCompletionHours: string;
  vitalsWarningThreshold: string;
};

export type PharmacySettingsState = {
  defaultLowStockThreshold: string;
  thermalPrintTemplate: string;
  printEnabledByDefaultOnDispense: boolean;
  allowEditBeforeDispense: boolean;
  allowEditAfterDispense: boolean;
};

export type SecuritySettingsState = {
  minimumPasswordLength: string;
  tokenRotationPolicy: string;
  forceStrongPasswordRule: boolean;
  rotateSessionOnRefresh: boolean;
  showAuditTrailInAdminPages: boolean;
};

export type SystemSettingsState = {
  dashboardRefreshSeconds: string;
  defaultTheme: string;
  enableSoftDeleteBehavior: boolean;
  allowAppointmentDoubleBooking: boolean;
  systemNotes: string;
};
