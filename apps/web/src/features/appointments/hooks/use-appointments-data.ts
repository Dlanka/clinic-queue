import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import {
  AppointmentService,
  type Appointment,
  type AppointmentStatus
} from "@/services/appointment.service";
import { DoctorService } from "@/services/doctor.service";
import { PatientService } from "@/services/patient.service";
import type { AppointmentFormValues } from "../schemas/appointment-form.schema";
import {
  appointmentsQueryKey,
  doctorsQueryKey,
  patientsQueryKey
} from "../store/appointments.store";

type UseAppointmentsDataParams = {
  statusFilter: "ALL" | AppointmentStatus;
  onSettledSuccess: () => void;
};

type SubmitAppointmentPayload = {
  appointment: Appointment | null;
  values: AppointmentFormValues;
};

export function useAppointmentsData({ statusFilter, onSettledSuccess }: UseAppointmentsDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: appointmentsQueryKey(statusFilter),
    queryFn: () => AppointmentService.list(statusFilter)
  });

  const doctorsQuery = useQuery({
    queryKey: doctorsQueryKey,
    queryFn: DoctorService.list
  });

  const patientsQuery = useQuery({
    queryKey: patientsQueryKey,
    queryFn: PatientService.list
  });

  const createMutation = useMutation({
    mutationFn: AppointmentService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Create failed", error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof AppointmentService.update>[1] }) =>
      AppointmentService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: AppointmentService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted");
    },
    onError: (error: Error) => {
      toast.error("Delete failed", error.message);
    }
  });

  const rows = useMemo(() => appointmentsQuery.data ?? [], [appointmentsQuery.data]);
  const doctorOptions = useMemo(
    () =>
      (doctorsQuery.data ?? []).map((doctor) => ({
        value: doctor.id,
        label: `${doctor.name} (${doctor.specialization})`
      })),
    [doctorsQuery.data]
  );
  const patientOptions = useMemo(
    () =>
      (patientsQuery.data ?? [])
        .filter((patient) => patient.status === "ACTIVE")
        .map((patient) => ({ value: patient.id, label: patient.fullName })),
    [patientsQuery.data]
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const submitAppointment = ({ appointment, values }: SubmitAppointmentPayload) => {
    const payload = {
      patientId: values.patientId,
      doctorId: values.doctorId,
      scheduledAt: new Date(values.scheduledAtLocal).toISOString(),
      status: values.status,
      notes: values.notes?.trim() || undefined
    };

    if (appointment) {
      updateMutation.mutate({ id: appointment.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  return {
    rows,
    doctorOptions,
    patientOptions,
    isSubmitting,
    appointmentsQuery,
    doctorsQuery,
    patientsQuery,
    deleteMutation,
    submitAppointment
  };
}
