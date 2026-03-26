import { format } from "date-fns";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/ui";
import { useMe } from "@/hooks/use-me";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import { PatientService } from "@/services/patient.service";
import { QueueService, type QueueEntry } from "@/services/queue.service";
import {
  calculateAgeFromDate,
  initialsFromName,
  normalizeDoctorName,
  sortByQueueAndPriority
} from "@/features/consultation/utils/workspace.utils";

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function useConsultationWorkspace() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const meQuery = useMe();
  const settingsQuery = useTenantSettings();
  const today = format(new Date(), "yyyy-MM-dd");
  const autoRefreshMs = parsePositiveInt(settingsQuery.data?.queue.autoRefreshSeconds, 30) * 1000;

  const queueQuery = useQuery({
    queryKey: ["queue", "ALL", "consultation-workspace", today],
    queryFn: () => QueueService.list("ALL", { date: today }),
    refetchInterval: autoRefreshMs
  });

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: PatientService.list
  });

  const startMutation = useMutation({
    mutationFn: QueueService.start,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Consultation started");
    },
    onError: (error: Error) => {
      toast.error("Failed to start consultation", error.message);
    }
  });

  const scopedRows = useMemo(() => {
    const allRows = queueQuery.data ?? [];
    const accountName = meQuery.data?.account.name;
    if (!accountName) {
      return [];
    }

    const normalizedAccountName = normalizeDoctorName(accountName);
    return allRows.filter((row) => {
      const normalizedQueueDoctorName = normalizeDoctorName(row.doctorName);
      return (
        normalizedQueueDoctorName === normalizedAccountName ||
        normalizedQueueDoctorName.includes(normalizedAccountName) ||
        normalizedAccountName.includes(normalizedQueueDoctorName)
      );
    });
  }, [meQuery.data?.account.name, queueQuery.data]);

  const currentEntry = useMemo(
    () =>
      scopedRows
        .filter((row) => row.status === "IN_PROGRESS")
        .sort((a, b) => {
          const aTime = new Date(a.startedAt ?? a.createdAt).getTime();
          const bTime = new Date(b.startedAt ?? b.createdAt).getTime();
          return aTime - bTime;
        })[0] ?? null,
    [scopedRows]
  );

  const waitingRows = useMemo(
    () => sortByQueueAndPriority(scopedRows.filter((row) => row.status === "WAITING")),
    [scopedRows]
  );

  const recentCompletedRows = useMemo(
    () =>
      [...scopedRows]
        .filter((row) => row.status === "COMPLETED")
        .sort((a, b) => {
          const aTime = new Date(a.completedAt ?? a.createdAt).getTime();
          const bTime = new Date(b.completedAt ?? b.createdAt).getTime();
          return bTime - aTime;
        }),
    [scopedRows]
  );

  const currentPatient = useMemo(() => {
    if (!currentEntry) {
      return null;
    }

    return (
      (patientsQuery.data ?? []).find((patient) => patient.id === currentEntry.patientId) ?? null
    );
  }, [currentEntry, patientsQuery.data]);

  const handleOpenConsultation = (entry: QueueEntry) => {
    navigate({
      to: "/consultation/$queueId",
      params: { queueId: entry.id }
    });
  };

  const handleStart = (entry: QueueEntry) => {
    startMutation.mutate(entry.id, {
      onSuccess: async () => {
        await navigate({
          to: "/consultation/$queueId",
          params: { queueId: entry.id }
        });
      }
    });
  };

  const doctorDisplayName =
    currentEntry?.doctorName ?? waitingRows[0]?.doctorName ?? meQuery.data?.account.name ?? "Doctor";

  const doctorInitials = initialsFromName(doctorDisplayName);
  const priorityCount = waitingRows.filter((row) => row.isPriority).length;
  const currentPatientAge = calculateAgeFromDate(currentPatient?.dateOfBirth);

  return {
    meQuery,
    queueQuery,
    startMutation,
    currentEntry,
    waitingRows,
    recentCompletedRows,
    currentPatient,
    currentPatientAge,
    doctorDisplayName,
    doctorInitials,
    priorityCount,
    handleOpenConsultation,
    handleStart
  };
}
