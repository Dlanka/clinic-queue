import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { differenceInMinutes, format, isToday, parseISO } from "date-fns";
import { Badge, Button, Card, EmptyState, PageHeader, Table } from "@/components/ui";
import { useMe } from "@/hooks/use-me";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import { AppointmentService } from "@/services/appointment.service";
import { MedicineService } from "@/services/medicine.service";
import { PatientService } from "@/services/patient.service";
import { PrescriptionService } from "@/services/prescription.service";
import { QueueService, type QueueStatus } from "@/services/queue.service";
import { formatQueueTicket } from "@/utils/queue-ticket";

type AppRole = "ADMIN" | "RECEPTION" | "DOCTOR" | "NURSE" | "PHARMACY_STAFF";

function hasAnyRole(memberRoles: string[] | undefined, allowedRoles: AppRole[]) {
  if (!memberRoles?.length) {
    return false;
  }

  return memberRoles.some((role) => allowedRoles.includes(role as AppRole));
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function queueStatusTone(status: QueueStatus): "warning" | "info" | "success" | "danger" {
  if (status === "WAITING") {
    return "warning";
  }

  if (status === "IN_PROGRESS") {
    return "info";
  }

  if (status === "COMPLETED") {
    return "success";
  }

  return "danger";
}

export const Route = createFileRoute("/")({
  component: DashboardPage
});

function DashboardPage() {
  const navigate = useNavigate();
  const meQuery = useMe();
  const settingsQuery = useTenantSettings();
  const memberRoles = meQuery.data?.member.roles;
  const dashboardRefreshMs = parsePositiveInt(settingsQuery.data?.system.dashboardRefreshSeconds, 30) * 1000;
  const queueSettings = settingsQuery.data?.queue;
  const today = format(new Date(), "yyyy-MM-dd");

  const shouldRedirectDoctorToConsultation =
    (settingsQuery.data?.access.doctorLandingConsultation ?? true) &&
    memberRoles?.includes("DOCTOR") &&
    !memberRoles?.some((role) => ["ADMIN", "RECEPTION", "NURSE", "PHARMACY_STAFF"].includes(role));

  useEffect(() => {
    if (!shouldRedirectDoctorToConsultation) {
      return;
    }

    void navigate({ to: "/consultation" });
  }, [navigate, shouldRedirectDoctorToConsultation]);

  if (shouldRedirectDoctorToConsultation) {
    return <div className="py-8 text-center text-sm text-neutral-70">Opening consultation...</div>;
  }
  const canAccessQueue = hasAnyRole(memberRoles, ["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]);
  const canAccessAppointments = hasAnyRole(memberRoles, ["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]);
  const canAccessPatients = hasAnyRole(memberRoles, ["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]);
  const canAccessPrescriptions = hasAnyRole(memberRoles, [
    "ADMIN",
    "RECEPTION",
    "DOCTOR",
    "NURSE",
    "PHARMACY_STAFF"
  ]);
  const canAccessMedicines = hasAnyRole(memberRoles, [
    "ADMIN",
    "RECEPTION",
    "DOCTOR",
    "NURSE",
    "PHARMACY_STAFF"
  ]);

  const queueQuery = useQuery({
    queryKey: ["dashboard", "queue", today],
    queryFn: () => QueueService.list("ALL", { date: today }),
    enabled: canAccessQueue,
    refetchInterval: canAccessQueue ? dashboardRefreshMs : false
  });

  const appointmentsQuery = useQuery({
    queryKey: ["dashboard", "appointments"],
    queryFn: () => AppointmentService.list("ALL"),
    enabled: canAccessAppointments,
    refetchInterval: canAccessAppointments ? dashboardRefreshMs : false
  });

  const patientsQuery = useQuery({
    queryKey: ["dashboard", "patients"],
    queryFn: PatientService.list,
    enabled: canAccessPatients,
    refetchInterval: canAccessPatients ? dashboardRefreshMs : false
  });

  const prescriptionsQuery = useQuery({
    queryKey: ["dashboard", "prescriptions"],
    queryFn: () => PrescriptionService.list(),
    enabled: canAccessPrescriptions,
    refetchInterval: canAccessPrescriptions ? dashboardRefreshMs : false
  });

  const medicinesQuery = useQuery({
    queryKey: ["dashboard", "medicines"],
    queryFn: MedicineService.list,
    enabled: canAccessMedicines,
    refetchInterval: canAccessMedicines ? dashboardRefreshMs : false
  });

  const queueRows = useMemo(() => {
    const rows = queueQuery.data ?? [];
    return [...rows].sort((a, b) => a.queueNumber - b.queueNumber);
  }, [queueQuery.data]);

  const upcomingAppointments = useMemo(() => {
    const now = Date.now();

    return (appointmentsQuery.data ?? [])
      .filter((row) => row.status === "SCHEDULED")
      .filter((row) => new Date(row.scheduledAt).getTime() >= now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 6);
  }, [appointmentsQuery.data]);

  const lowStockMedicines = useMemo(
    () =>
      (medicinesQuery.data ?? [])
        .filter((medicine) => medicine.stockQty <= 0 || medicine.isLowStock)
        .sort((a, b) => a.stockQty - b.stockQty)
        .slice(0, 6),
    [medicinesQuery.data]
  );

  const waitingCount = queueRows.filter((row) => row.status === "WAITING").length;
  const inProgressCount = queueRows.filter((row) => row.status === "IN_PROGRESS").length;
  const pendingPrescriptionCount = (prescriptionsQuery.data ?? []).filter(
    (row) => row.status === "PRESCRIBED"
  ).length;
  const lowStockCount = lowStockMedicines.length;

  const activePatientCount = (patientsQuery.data ?? []).filter((row) => row.status === "ACTIVE").length;

  const todayScheduledCount = (appointmentsQuery.data ?? []).filter(
    (row) => row.status === "SCHEDULED" && isToday(parseISO(row.scheduledAt))
  ).length;

  const averageWaitLabel = useMemo(() => {
    const waitingRows = queueRows.filter((row) => row.status === "WAITING");
    if (waitingRows.length === 0) {
      return "-";
    }

    const totalMinutes = waitingRows.reduce(
      (sum, row) => sum + Math.max(1, differenceInMinutes(new Date(), new Date(row.createdAt))),
      0
    );

    return `${Math.round(totalMinutes / waitingRows.length)} min`;
  }, [queueRows]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle={`${format(new Date(), "EEEE, MMMM d, yyyy")} · Real-time clinic snapshot`}
        iconName="layoutDashboard"
        iconClassName="bg-primary-soft text-primary"
        action={
          <Button
            size="sm"
            variant="outlined"
            intent="neutral"
            startIconName="refreshCcw"
            onClick={() => {
              void queueQuery.refetch();
              void appointmentsQuery.refetch();
              void patientsQuery.refetch();
              void prescriptionsQuery.refetch();
              void medicinesQuery.refetch();
            }}
          >
            Refresh
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Waiting Queue"
          value={canAccessQueue ? String(waitingCount) : "-"}
          tone="warning"
        />
        <DashboardStatCard
          label="In Progress"
          value={canAccessQueue ? String(inProgressCount) : "-"}
          tone="info"
        />
        <DashboardStatCard
          label="Pending Prescriptions"
          value={canAccessPrescriptions ? String(pendingPrescriptionCount) : "-"}
          tone="info"
        />
        <DashboardStatCard
          label="Low Stock Medicines"
          value={canAccessMedicines ? String(lowStockCount) : "-"}
          tone="danger"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <Card.Header
            title="Today's Queue"
            subtitle={`Avg wait: ${averageWaitLabel}`}
            iconName="clipboardList"
            iconClassName="bg-tertiary-soft text-tertiary"
            className="border-b border-subtle"
            action={
              canAccessQueue ? (
                <Button size="sm" variant="text" intent="neutral" onClick={() => navigate({ to: "/queue" })}>
                  Open Queue
                </Button>
              ) : null
            }
          />
          <Card.Body className="p-0">
            {!canAccessQueue ? (
              <EmptyState
                title="Access Restricted"
                description="Your role cannot view queue records."
                iconName="lock"
                className="min-h-60"
              />
            ) : (
              <Table
                columns={[
                  {
                    key: "queue",
                    header: "Queue",
                    render: (row) => (
                      <span className="font-semibold text-neutral-95">{formatQueueTicket(row.queueNumber, queueSettings)}</span>
                    )
                  },
                  {
                    key: "patient",
                    header: "Patient",
                    render: (row) => <span className="text-neutral-95">{row.patientName}</span>
                  },
                  {
                    key: "doctor",
                    header: "Doctor",
                    render: (row) => <span className="text-neutral-80">{row.doctorName}</span>
                  },
                  {
                    key: "status",
                    header: "Status",
                    render: (row) => (
                      <Badge tone={queueStatusTone(row.status)}>{row.status.replace("_", " ")}</Badge>
                    )
                  }
                ]}
                rows={queueRows.slice(0, 8)}
                getRowId={(row) => row.id}
                emptyMessage={queueQuery.isLoading ? "Loading queue..." : "No queue entries for today."}
              />
            )}
          </Card.Body>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <Card.Header
              title="Upcoming Appointments"
              subtitle={`Today's scheduled: ${canAccessAppointments ? todayScheduledCount : "-"}`}
              iconName="calendarClock"
              iconClassName="bg-info-soft text-info"
              className="border-b border-subtle"
              action={
                canAccessAppointments ? (
                  <Button
                    size="sm"
                    variant="text"
                    intent="neutral"
                    onClick={() => navigate({ to: "/appointments" })}
                  >
                    View
                  </Button>
                ) : null
              }
            />
            <Card.Body className="space-y-2">
              {!canAccessAppointments ? (
                <p className="text-sm text-neutral-70">Your role cannot access appointment records.</p>
              ) : upcomingAppointments.length === 0 ? (
                <p className="text-sm text-neutral-70">
                  {appointmentsQuery.isLoading ? "Loading appointments..." : "No upcoming appointments."}
                </p>
              ) : (
                upcomingAppointments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-subtle bg-neutral-20 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-neutral-95">{item.patientName}</p>
                    <p className="text-xs text-neutral-70">
                      {format(new Date(item.scheduledAt), "MMM d, h:mm a")} · {item.doctorName}
                    </p>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          <Card className="overflow-hidden">
            <Card.Header
              title="Stock Alerts"
              subtitle={`Active patients: ${canAccessPatients ? activePatientCount : "-"}`}
              iconName="list"
              iconClassName="bg-warning-soft text-warning"
              className="border-b border-subtle"
              action={
                canAccessMedicines ? (
                  <Button
                    size="sm"
                    variant="text"
                    intent="neutral"
                    onClick={() => navigate({ to: "/medicines" })}
                  >
                    Medicines
                  </Button>
                ) : null
              }
            />
            <Card.Body className="space-y-2">
              {!canAccessMedicines ? (
                <p className="text-sm text-neutral-70">Your role cannot access medicine stock records.</p>
              ) : lowStockMedicines.length === 0 ? (
                <p className="text-sm text-neutral-70">
                  {medicinesQuery.isLoading ? "Loading stock..." : "No low-stock medicines."}
                </p>
              ) : (
                lowStockMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="flex items-center justify-between rounded-md border border-subtle bg-neutral-20 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-95">{medicine.name}</p>
                      <p className="text-xs text-neutral-70">{medicine.category || "Uncategorized"}</p>
                    </div>
                    <Badge tone={medicine.stockQty <= 0 ? "danger" : "warning"}>
                      {medicine.stockQty <= 0 ? "OUT" : `${medicine.stockQty} left`}
                    </Badge>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardStatCard({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: "warning" | "danger" | "info";
}) {
  return (
    <Card>
      <Card.Body className="space-y-1 px-5 py-4">
        <p className="text-2xl font-bold text-neutral-95">{value}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-neutral-70">{label}</p>
          <Badge tone={tone} size="sm">
            Live
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
}












