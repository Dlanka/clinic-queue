import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/ui";
import { useMe } from "@/hooks/use-me";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import type { Patient } from "@/services/patient.service";
import { QueueFormModal, QueuePageHeader, QueueStatsGrid, QueueTableCard } from "./components";
import { QueuePageProvider, useQueuePageContext } from "./context/queue-page.context";
import { useQueueData } from "./hooks";
import type { QueueFormValues } from "./schemas/queue-form.schema";
import type { QueueStatusFilter } from "./store/queue.store";

function hasAnyRole(memberRoles: string[] | undefined, roles: string[]) {
  if (!memberRoles) {
    return false;
  }

  return memberRoles.some((role) => roles.includes(role));
}

function normalizePhone(value: string | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function QueuePage() {
  return (
    <QueuePageProvider>
      <QueuePageContent />
    </QueuePageProvider>
  );
}

function QueuePageContent() {
  const { modalOpen, openCreateModal, closeModal } = useQueuePageContext();
  const toast = useToast();
  const navigate = useNavigate();
  const meQuery = useMe();
  const settingsQuery = useTenantSettings();

  const [statusFilter, setStatusFilter] = useState<QueueStatusFilter>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [autoRefresh] = useState(true);
  const [duplicatePatients, setDuplicatePatients] = useState<Patient[]>([]);

  const queueSettings = settingsQuery.data?.queue;
  const autoRefreshIntervalSeconds = parsePositiveInt(queueSettings?.autoRefreshSeconds, 30);
  const defaultFilterToToday = queueSettings?.defaultFilterToToday ?? true;
  const allowPriorityQueueEntries = queueSettings?.allowPriorityQueueEntries ?? true;
  const showWaitTimeEstimates = queueSettings?.showWaitTimeEstimates ?? false;

  const {
    queueQuery,
    doctorsQuery,
    patientsQuery,
    rows,
    allRows,
    counts,
    doctorOptions,
    actionBusy,
    createMutation,
    createPatientMutation,
    startMutation,
    cancelMutation
  } = useQueueData({
    statusFilter,
    searchTerm,
    autoRefresh,
    autoRefreshIntervalMs: autoRefreshIntervalSeconds * 1000,
    listAllDates: !defaultFilterToToday,
    onCreateSuccess: closeModal
  });

  const meRoles = meQuery.data?.member.roles;
  const canAddToQueue = hasAnyRole(meRoles, ["ADMIN", "RECEPTION", "DOCTOR"]);
  const canOperateQueue = hasAnyRole(meRoles, ["DOCTOR"]);

  const createLoading = createMutation.isPending || createPatientMutation.isPending;

  const clearDuplicatePatients = () => {
    if (duplicatePatients.length === 0) {
      return;
    }

    setDuplicatePatients([]);
  };

  const queueExistingPatient = (
    patientId: string,
    doctorId: string,
    notes: string | undefined,
    isPriority: boolean
  ) => {
    createMutation.mutate({
      patientId,
      doctorId,
      notes,
      isPriority: allowPriorityQueueEntries ? isPriority : false
    });
  };

  const createAndQueuePatient = async (values: QueueFormValues) => {
    const createdPatient = await createPatientMutation.mutateAsync({
      firstName: values.quickFirstName?.trim() ?? "",
      lastName: values.quickLastName?.trim() ?? "",
      phone: values.quickPhone?.trim() || undefined,
      dateOfBirth: values.quickDateOfBirth?.trim() || undefined,
      gender: values.quickGender,
      status: "ACTIVE"
    });

    queueExistingPatient(
      createdPatient.id,
      values.doctorId,
      values.notes?.trim() || undefined,
      Boolean(values.isPriority)
    );
  };

  const handleCreateQueue = async (values: QueueFormValues) => {
    if (values.patientMode === "existing") {
      clearDuplicatePatients();
      queueExistingPatient(
        values.patientId ?? "",
        values.doctorId,
        values.notes?.trim() || undefined,
        Boolean(values.isPriority)
      );
      return;
    }

    const normalizedInputPhone = normalizePhone(values.quickPhone?.trim());
    const matchedPatients = normalizedInputPhone
      ? (patientsQuery.data ?? []).filter((patient) => {
          if (patient.status !== "ACTIVE") {
            return false;
          }

          return normalizePhone(patient.phone) === normalizedInputPhone;
        })
      : [];

    if (matchedPatients.length > 0) {
      setDuplicatePatients(matchedPatients);
      toast.error("Phone number already exists. Choose existing patient or create new anyway.");
      return;
    }

    clearDuplicatePatients();
    await createAndQueuePatient(values);
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <QueuePageHeader
        autoRefresh={autoRefresh}
        autoRefreshIntervalSeconds={autoRefreshIntervalSeconds}
        canAddToQueue={canAddToQueue}
        onCreate={openCreateModal}
      />

      <QueueStatsGrid counts={counts} />

      <QueueTableCard
        rows={rows}
        allRows={allRows}
        isLoading={queueQuery.isLoading}
        dataUpdatedAt={queueQuery.dataUpdatedAt}
        statusFilter={statusFilter}
        searchTerm={searchTerm}
        canAddToQueue={canAddToQueue}
        canOperateQueue={canOperateQueue}
        actionBusy={actionBusy}
        showWaitTimeEstimates={showWaitTimeEstimates}
        onSearch={setSearchTerm}
        onStatusChange={setStatusFilter}
        onRefresh={() => queueQuery.refetch()}
        onStart={(entry) =>
          startMutation.mutate(entry.id, {
            onSuccess: async () => {
              await navigate({
                to: "/consultation/$queueId",
                params: { queueId: entry.id }
              });
            }
          })
        }
        onCancel={(id) => cancelMutation.mutate(id)}
        onOpenConsultation={(entry) =>
          navigate({
            to: "/consultation/$queueId",
            params: { queueId: entry.id }
          })
        }
      />

      <QueueFormModal
        open={modalOpen}
        loading={createLoading}
        patients={patientsQuery.data ?? []}
        doctorOptions={doctorOptions}
        patientsLoading={patientsQuery.isLoading}
        doctorsLoading={doctorsQuery.isLoading}
        duplicatePatients={duplicatePatients}
        allowPriorityQueueEntries={allowPriorityQueueEntries}
        onClose={() => {
          clearDuplicatePatients();
          closeModal();
        }}
        onSubmit={handleCreateQueue}
        onDismissDuplicateNotice={clearDuplicatePatients}
        onUseExistingPatient={(patientId, values) => {
          clearDuplicatePatients();
          queueExistingPatient(
            patientId,
            values.doctorId,
            values.notes?.trim() || undefined,
            Boolean(values.isPriority)
          );
        }}
        onCreateNewPatientAnyway={async (values) => {
          clearDuplicatePatients();
          await createAndQueuePatient(values);
        }}
      />
    </div>
  );
}

