import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { DoctorService } from "@/services/doctor.service";
import { MedicineService } from "@/services/medicine.service";
import { PatientService, type Patient } from "@/services/patient.service";
import { PrescriptionService, type PrescriptionItemInput } from "@/services/prescription.service";
import { VisitService } from "@/services/visit.service";
import type { PatientFormValues } from "../schemas/patient-form.schema";
import type { VisitFormValues } from "../schemas/visit-form.schema";
import { doctorsQueryKey, patientsQueryKey } from "../store/patients.store";

type SubmitPatientPayload = {
  patient: Patient | null;
  values: PatientFormValues;
};

type SubmitVisitPayload = {
  patientId: string;
  values: VisitFormValues;
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

  const doctorsQuery = useQuery({
    queryKey: doctorsQueryKey,
    queryFn: DoctorService.list
  });

  const medicinesQuery = useQuery({
    queryKey: ["medicines"],
    queryFn: MedicineService.list
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

  const createVisitMutation = useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: VisitFormValues }) =>
      VisitService.create(patientId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient-visits", selectedPatientId] });
      toast.success("Visit recorded");
    },
    onError: (error: Error) => {
      toast.error("Visit create failed", error.message);
    }
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: ({ visitId, items }: { visitId: string; items: PrescriptionItemInput[] }) =>
      PrescriptionService.createForVisit(visitId, items),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast.success("Prescription created");
    },
    onError: (error: Error) => {
      toast.error("Prescription create failed", error.message);
    }
  });

  const rows = useMemo(() => patientsQuery.data ?? [], [patientsQuery.data]);
  const doctorOptions = useMemo(
    () =>
      (doctorsQuery.data ?? []).map((doctor) => ({
        value: doctor.id,
        label: doctor.name
      })),
    [doctorsQuery.data]
  );

  const medicineOptions = useMemo(
    () =>
      (medicinesQuery.data ?? []).map((medicine) => ({
        value: medicine.id,
        label: `${medicine.name} (${medicine.stockQty})`
      })),
    [medicinesQuery.data]
  );

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

  const submitVisit = ({ patientId, values }: SubmitVisitPayload) => {
    const payload = {
      ...values,
      visitedAt: values.visitedAt || undefined,
      diagnosis: values.diagnosis || undefined,
      notes: values.notes || undefined
    };

    createVisitMutation.mutate({ patientId, payload });
  };

  const submitPrescription = (visitId: string, items: PrescriptionItemInput[]) => {
    createPrescriptionMutation.mutate({ visitId, items });
  };

  return {
    rows,
    doctorOptions,
    medicineOptions,
    patientsQuery,
    doctorsQuery,
    medicinesQuery,
    selectedPatientQuery,
    visitsQuery,
    createVisitMutation,
    createPrescriptionMutation,
    deletePatientMutation,
    isPatientSaving: createPatientMutation.isPending || updatePatientMutation.isPending,
    submitPatient,
    submitVisit,
    submitPrescription
  };
}
