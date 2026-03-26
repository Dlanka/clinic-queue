import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge, Button, PageHeader, useToast } from "@/components/ui";
import { useMe } from "@/hooks/use-me";
import { meQueryKey } from "@/hooks/use-me";
import { settingsQueryKey } from "@/hooks/use-tenant-settings";
import { SettingsService } from "@/services/settings.service";
import { SettingsAccessSection } from "./components/settings-access-section";
import { SettingsClinicalSection } from "./components/settings-clinical-section";
import { SettingsGeneralSection } from "./components/settings-general-section";
import { SettingsNavigation } from "./components/settings-navigation";
import { SettingsPharmacySection } from "./components/settings-pharmacy-section";
import { SettingsSecuritySection } from "./components/settings-security-section";
import { SettingsPlaceholderSection } from "./components/settings-placeholder-section";
import { SettingsQueueSection } from "./components/settings-queue-section";
import { SettingsSectionCard } from "./components/settings-section-card";
import { SettingsSystemSection } from "./components/settings-system-section";
import type {
  AccessSettingsState,
  ClinicalSettingsState,
  GeneralSettingsState,
  PharmacySettingsState,
  SecuritySettingsState,
  SettingsNavItem,
  SystemSettingsState,
  QueueSettingsState,
  SettingsTab
} from "./settings.types";

const settingsNavItems: SettingsNavItem[] = [
  { value: "general", label: "General", subtitle: "Clinic identity & locale", iconName: "home" },
  {
    value: "access",
    label: "Access & Roles",
    subtitle: "Role policies & sessions",
    iconName: "user"
  },
  { value: "queue", label: "Queue", subtitle: "Queue preferences", iconName: "list" },
  {
    value: "clinical",
    label: "Clinical",
    subtitle: "Consultation guardrails",
    iconName: "activity"
  },
  { value: "pharmacy", label: "Pharmacy", subtitle: "Dispense & print", iconName: "table-2" },
  { value: "security", label: "Security", subtitle: "Password & hardening", iconName: "lock" },
  { value: "system", label: "System", subtitle: "Global UI & runtime", iconName: "settings" }
];

export function SettingsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const meQuery = useMe();

  const tenantName = meQuery.data?.tenant.name ?? "Clinic";
  const roles = meQuery.data?.member.roles ?? [];
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [general, setGeneral] = useState<GeneralSettingsState>({
    clinicName: tenantName,
    contactNumber: "+9477 000 0000",
    timezone: "Asia/Colombo",
    currency: "LKR - Sri Lankan Rupee",
    dateFormat: "MMM dd, yyyy",
    timeFormat: "12-hour (AM/PM)"
  });

  const [access, setAccess] = useState<AccessSettingsState>({
    doctorLandingConsultation: true,
    enforceRoleMatrix: true,
    allowConcurrentSessions: true,
    sessionTimeoutMinutes: "60",
    maxLoginAttempts: "5"
  });
  const [queue, setQueue] = useState<QueueSettingsState>({
    queuePrefix: "Q-",
    queueNumberDigits: "3",
    autoRefreshSeconds: "20",
    maxQueueSize: "100",
    allowPriorityQueueEntries: true,
    defaultFilterToToday: true,
    showWaitTimeEstimates: false
  });
  const [clinical, setClinical] = useState<ClinicalSettingsState>({
    symptomsRequired: true,
    diagnosisRequiredToComplete: true,
    lockConsultationAfterCompletion: true,
    enableVitalWarnings: true,
    editWindowAfterCompletionHours: "24",
    vitalsWarningThreshold: "Standard clinical ranges"
  });
  const [pharmacy, setPharmacy] = useState<PharmacySettingsState>({
    defaultLowStockThreshold: "20",
    thermalPrintTemplate: "80mm",
    printEnabledByDefaultOnDispense: false,
    allowEditBeforeDispense: true,
    allowEditAfterDispense: false
  });
  const [security, setSecurity] = useState<SecuritySettingsState>({
    minimumPasswordLength: "8",
    tokenRotationPolicy: "Cookie refresh token rotation",
    forceStrongPasswordRule: true,
    rotateSessionOnRefresh: true,
    showAuditTrailInAdminPages: true
  });
  const [system, setSystem] = useState<SystemSettingsState>({
    dashboardRefreshSeconds: "30",
    defaultTheme: "Dark",
    enableSoftDeleteBehavior: true,
    allowAppointmentDoubleBooking: false,
    systemNotes:
      "Basic settings page is active. Backend persistence can be connected once API endpoints are finalized."
  });

  const activeItem = useMemo(
    () => settingsNavItems.find((item) => item.value === activeTab),
    [activeTab]
  );

  const settingsQuery = useQuery({
    queryKey: settingsQueryKey,
    queryFn: SettingsService.get
  });

  useEffect(() => {
    if (!settingsQuery.data) {
      return;
    }

    setGeneral(settingsQuery.data.general);
    setAccess(settingsQuery.data.access);
    setQueue(settingsQuery.data.queue);
    setClinical(settingsQuery.data.clinical);
    setPharmacy(settingsQuery.data.pharmacy);
    setSecurity(settingsQuery.data.security);
    setSystem(settingsQuery.data.system);
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: SettingsService.update,
    onSuccess: async (settings) => {
      queryClient.setQueryData(settingsQueryKey, settings);
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      toast.success("Settings updated", `${activeItem?.label ?? "Section"} saved successfully.`);
    },
    onError: (error: Error) => {
      toast.error("Save failed", error.message);
    }
  });

  const subtitle =
    activeTab === "general"
      ? "Clinic identity and locale defaults"
      : activeTab === "access"
        ? "Role behavior and member session policies"
        : activeTab === "queue"
          ? "Operational queue preferences"
          : activeTab === "clinical"
            ? "Consultation and visit completion guardrails"
            : activeTab === "pharmacy"
              ? "Dispense controls and print preferences"
              : activeTab === "security"
                ? "Password and session hardening"
                : activeTab === "system"
                  ? "Global UI/runtime behavior for this tenant"
                  : "Section UI scaffolded. I can build this section next.";

  const handleSave = () => {
    const payload =
      activeTab === "general"
        ? { general }
        : activeTab === "access"
          ? { access }
          : activeTab === "queue"
            ? { queue }
            : activeTab === "clinical"
              ? { clinical }
              : activeTab === "pharmacy"
                ? { pharmacy }
                : activeTab === "security"
                  ? { security }
                  : activeTab === "system"
                    ? { system }
                    : {};

    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Configure clinic-wide behavior, workflow defaults, and system policies"
        iconName="settings"
        iconClassName="bg-primary-soft text-primary"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info" size="sm">
              {tenantName}
            </Badge>
            {roles.slice(0, 2).map((role) => (
              <Badge key={role} tone="neutral" size="sm">
                {role.replaceAll("_", " ")}
              </Badge>
            ))}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <SettingsNavigation
          items={settingsNavItems}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <section>
          <SettingsSectionCard
            title={activeItem?.label ?? "Settings"}
            subtitle={subtitle}
            iconName={activeItem?.iconName}
            iconClassName={
              activeTab === "queue"
                ? "bg-warning-soft text-warning"
                : activeTab === "pharmacy"
                  ? "bg-success-soft text-success"
                  : activeTab === "security"
                    ? "bg-danger-soft text-danger"
                    : activeTab === "access"
                      ? "bg-tertiary-soft text-tertiary"
                      : "bg-primary-soft text-primary"
            }
            action={
              <Button
                size="sm"
                startIconName="check"
                disabled={saveMutation.isPending || settingsQuery.isLoading}
                onClick={handleSave}
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            }
          >
            {activeTab === "general" ? (
              <SettingsGeneralSection value={general} onChange={setGeneral} />
            ) : activeTab === "access" ? (
              <SettingsAccessSection value={access} onChange={setAccess} />
            ) : activeTab === "queue" ? (
              <SettingsQueueSection value={queue} onChange={setQueue} />
            ) : activeTab === "clinical" ? (
              <SettingsClinicalSection value={clinical} onChange={setClinical} />
            ) : activeTab === "pharmacy" ? (
              <SettingsPharmacySection value={pharmacy} onChange={setPharmacy} />
            ) : activeTab === "security" ? (
              <SettingsSecuritySection value={security} onChange={setSecurity} />
            ) : activeTab === "system" ? (
              <SettingsSystemSection
                value={system}
                onChange={setSystem}
                onOpenProfile={() => navigate({ to: "/profile" })}
                onOpenUsers={() => navigate({ to: "/users" })}
              />
            ) : (
              <SettingsPlaceholderSection label={activeItem?.label} />
            )}
          </SettingsSectionCard>
        </section>
      </div>
    </div>
  );
}
