import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { PatientService, type Patient } from "@/services/patient.service";
import { PrescriptionService } from "@/services/prescription.service";
import { VisitService } from "@/services/visit.service";
import type { PatientFormValues } from "../schemas/patient-form.schema";
import { patientsQueryKey } from "../store/patients.store";

type SubmitPatientPayload = {
  patient: Patient | null;
  values: PatientFormValues;
};

type UsePatientsDataParams = {
  selectedPatientId: string | null;
  onPatientSettledSuccess: () => void;
};

export function usePatientsData({
  selectedPatientId,
  onPatientSettledSuccess
}: UsePatientsDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const patientsQuery = useQuery({
    queryKey: patientsQueryKey,
    queryFn: PatientService.list
  });

  const selectedPatientQuery = useQuery({
    queryKey: ["patient-detail", selectedPatientId],
    queryFn: () => PatientService.getById(String(selectedPatientId)),
    enabled: Boolean(selectedPatientId)
  });

  const visitsQuery = useQuery({
    queryKey: ["patient-visits", selectedPatientId],
    queryFn: () => VisitService.listByPatient(String(selectedPatientId)),
    enabled: Boolean(selectedPatientId)
  });

  const prescriptionsQuery = useQuery({
    queryKey: ["prescriptions"],
    queryFn: () => PrescriptionService.list()
  });

  const createPatientMutation = useMutation({
    mutationFn: PatientService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientsQueryKey });
      toast.success("Patient created");
      onPatientSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Create failed", error.message);
    }
  });

  const updatePatientMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PatientFormValues }) =>
      PatientService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientsQueryKey });
      await queryClient.invalidateQueries({ queryKey: ["patient-detail", selectedPatientId] });
      toast.success("Patient updated");
      onPatientSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const deletePatientMutation = useMutation({
    mutationFn: PatientService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: patientsQueryKey });
      toast.success("Patient deactivated");
    },
    onError: (error: Error) => {
      toast.error("Deactivate failed", error.message);
    }
  });

  const rows = useMemo(() => patientsQuery.data ?? [], [patientsQuery.data]);

  const submitPatient = ({ patient, values }: SubmitPatientPayload) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth || undefined,
      email: values.email || undefined
    };

    if (patient) {
      updatePatientMutation.mutate({ id: patient.id, payload });
      return;
    }

    createPatientMutation.mutate(payload);
  };

  return {
    rows,
    patientsQuery,
    selectedPatientQuery,
    visitsQuery,
    prescriptionsQuery,
    deletePatientMutation,
    isPatientSaving: createPatientMutation.isPending || updatePatientMutation.isPending,
    submitPatient
  };
}
