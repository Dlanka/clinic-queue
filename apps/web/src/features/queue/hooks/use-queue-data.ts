import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { DoctorService } from "@/services/doctor.service";
import { PatientService, type CreatePatientPayload } from "@/services/patient.service";
import { QueueService, type CreateQueueEntryPayload, type QueueStatus } from "@/services/queue.service";
import { queueQueryKey, type QueueStatusFilter } from "../store/queue.store";

interface UseQueueDataParams {
  statusFilter: QueueStatusFilter;
  searchTerm: string;
  autoRefresh: boolean;
  autoRefreshIntervalMs: number;
  listAllDates: boolean;
  onCreateSuccess: () => void;
}

export function useQueueData({
  statusFilter,
  searchTerm,
  autoRefresh,
  autoRefreshIntervalMs,
  listAllDates,
  onCreateSuccess
}: UseQueueDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const queueQuery = useQuery({
    queryKey: queueQueryKey,
    queryFn: () => QueueService.list("ALL", listAllDates ? { allDates: true } : undefined),
    refetchInterval: autoRefresh ? autoRefreshIntervalMs : false
  });

  const doctorsQuery = useQuery({
    queryKey: ["doctors"],
    queryFn: DoctorService.list
  });

  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: PatientService.list
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateQueueEntryPayload) => QueueService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Patient added to queue");
      onCreateSuccess();
    },
    onError: (error: Error) => {
      toast.error("Queue add failed", error.message);
    }
  });

  const createPatientMutation = useMutation({
    mutationFn: (payload: CreatePatientPayload) => PatientService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: Error) => {
      toast.error("Patient create failed", error.message);
    }
  });

  const startMutation = useMutation({
    mutationFn: QueueService.start,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Queue entry started");
    },
    onError: (error: Error) => {
      toast.error("Start failed", error.message);
    }
  });

  const completeMutation = useMutation({
    mutationFn: QueueService.complete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Queue entry completed");
    },
    onError: (error: Error) => {
      toast.error("Complete failed", error.message);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: QueueService.cancel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Queue entry cancelled");
    },
    onError: (error: Error) => {
      toast.error("Cancel failed", error.message);
    }
  });

  const doctorOptions = useMemo(
    () =>
      (doctorsQuery.data ?? [])
        .filter((doctor) => doctor.status === "ACTIVE")
        .map((doctor) => ({ value: doctor.id, label: `${doctor.name} (${doctor.specialization})` })),
    [doctorsQuery.data]
  );

  const patientOptions = useMemo(
    () =>
      (patientsQuery.data ?? [])
        .filter((patient) => patient.status === "ACTIVE")
        .map((patient) => ({ value: patient.id, label: patient.fullName })),
    [patientsQuery.data]
  );

  const allRows = useMemo(() => queueQuery.data ?? [], [queueQuery.data]);

  const counts = useMemo(
    () => ({
      WAITING: allRows.filter((row) => row.status === "WAITING").length,
      IN_PROGRESS: allRows.filter((row) => row.status === "IN_PROGRESS").length,
      COMPLETED: allRows.filter((row) => row.status === "COMPLETED").length,
      CANCELLED: allRows.filter((row) => row.status === "CANCELLED").length
    }),
    [allRows]
  );

  const rows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return allRows.filter((row) => {
      if (statusFilter !== "ALL" && row.status !== statusFilter) {
        return false;
      }

      if (!term) {
        return true;
      }

      return (
        row.patientName.toLowerCase().includes(term) ||
        row.doctorName.toLowerCase().includes(term) ||
        String(row.queueNumber).includes(term)
      );
    });
  }, [allRows, searchTerm, statusFilter]);

  const actionBusy =
    startMutation.isPending || completeMutation.isPending || cancelMutation.isPending;

  return {
    queueQuery,
    doctorsQuery,
    patientsQuery,
    rows,
    allRows,
    counts,
    doctorOptions,
    patientOptions,
    actionBusy,
    createMutation,
    createPatientMutation,
    startMutation,
    completeMutation,
    cancelMutation
  };
}

export function statusTone(status: QueueStatus): "info" | "warning" | "success" | "danger" {
  if (status === "IN_PROGRESS") {
    return "info";
  }

  if (status === "COMPLETED") {
    return "success";
  }

  if (status === "CANCELLED") {
    return "danger";
  }

  return "warning";
}

