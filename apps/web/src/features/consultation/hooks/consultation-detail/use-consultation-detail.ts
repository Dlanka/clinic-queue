import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui";
import { MedicineService } from "@/services/medicine.service";
import { PatientService } from "@/services/patient.service";
import { PrescriptionService } from "@/services/prescription.service";
import { QueueService } from "@/services/queue.service";
import { VisitService } from "@/services/visit.service";
import {
  type ConsultationValues,
  validateCompleteConsultation
} from "@/features/queue/schemas/consultation.schema";
import {
  buildVisitPayload,
  consultationResolver,
  initialConsultationValues
} from "@/features/consultation/utils/detail.utils";

interface UseConsultationDetailArgs {
  queueId: string;
  backTo: "/queue" | "/consultation";
  amendMode?: boolean;
}

export function useConsultationDetail({
  queueId,
  backTo,
  amendMode = false
}: UseConsultationDetailArgs) {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const autoStartAttempted = useRef(false);
  const [activeTab, setActiveTab] = useState<"clinical" | "prescription">("clinical");
  const [now, setNow] = useState(() => Date.now());

  const form = useForm<ConsultationValues>({
    resolver: consultationResolver,
    defaultValues: initialConsultationValues()
  });

  const prescriptionFieldArray = useFieldArray({
    control: form.control,
    name: "prescriptionItems"
  });

  const queueEntryQuery = useQuery({
    queryKey: ["queue", queueId],
    queryFn: () => QueueService.getById(queueId)
  });

  const patientQuery = useQuery({
    queryKey: ["patients", queueEntryQuery.data?.patientId],
    enabled: Boolean(queueEntryQuery.data?.patientId),
    queryFn: () => PatientService.getById(queueEntryQuery.data!.patientId)
  });

  const visitsQuery = useQuery({
    queryKey: ["visits", queueEntryQuery.data?.patientId],
    enabled: Boolean(queueEntryQuery.data?.patientId),
    queryFn: () => VisitService.listByPatient(queueEntryQuery.data!.patientId)
  });

  const medicinesQuery = useQuery({
    queryKey: ["medicines"],
    queryFn: MedicineService.list
  });

  const currentVisitQuery = useQuery({
    queryKey: ["queue", queueId, "visit"],
    queryFn: () => VisitService.getByQueueEntry(queueId)
  });

  const currentVisitPrescriptionsQuery = useQuery({
    queryKey: ["prescriptions", "visit", currentVisitQuery.data?.id],
    enabled: Boolean(currentVisitQuery.data?.id),
    queryFn: () => PrescriptionService.list(undefined, currentVisitQuery.data!.id)
  });

  const editablePrescription = useMemo(
    () =>
      (currentVisitPrescriptionsQuery.data ?? []).find(
        (prescription) => prescription.status === "PRESCRIBED"
      ),
    [currentVisitPrescriptionsQuery.data]
  );

  const latestPrescriptionForDisplay = useMemo(
    () => editablePrescription ?? (currentVisitPrescriptionsQuery.data ?? [])[0],
    [currentVisitPrescriptionsQuery.data, editablePrescription]
  );

  const patientPrescriptionsQuery = useQuery({
    queryKey: ["prescriptions", "patient", queueEntryQuery.data?.patientId],
    enabled: Boolean(queueEntryQuery.data?.patientId),
    queryFn: async () => {
      const prescriptions = await PrescriptionService.list();
      return prescriptions.filter(
        (prescription) => prescription.patientId === queueEntryQuery.data!.patientId
      );
    }
  });

  const startMutation = useMutation({
    mutationFn: QueueService.start,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue", queueId] });
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Consultation started");
    },
    onError: (error: Error) => {
      toast.error("Failed to start consultation", error.message);
    }
  });

  const saveVisitMutation = useMutation({
    mutationFn: async (values: ConsultationValues) => {
      const entry = queueEntryQuery.data;
      if (!entry) {
        throw new Error("Queue entry not found");
      }

      const payload = buildVisitPayload(values, queueId);
      if (currentVisitQuery.data) {
        return VisitService.update(entry.patientId, currentVisitQuery.data.id, payload);
      }

      return VisitService.create(entry.patientId, payload);
    },
    onSuccess: async (visit) => {
      await queryClient.invalidateQueries({ queryKey: ["queue", queueId, "visit"] });
      await queryClient.invalidateQueries({ queryKey: ["visits", visit.patientId] });
      toast.success("Visit saved");
    },
    onError: (error: Error) => {
      toast.error("Save failed", error.message);
    }
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: ({ visitId, values }: { visitId: string; values: ConsultationValues }) => {
      const items = values.prescriptionItems
        .filter((item) => item.medicineId?.trim())
        .map((item) => ({
          medicineId: item.medicineId!.trim(),
          quantity: 1,
          dosage: item.dosage?.trim() || undefined,
          frequency: item.frequency?.trim() || undefined,
          duration:
            typeof item.durationDays === "number" ? `${item.durationDays} day(s)` : undefined,
          instructions: item.instructions?.trim() || undefined
        }));

      return PrescriptionService.createForVisit(visitId, items);
    },
    onSuccess: async (_prescription, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["prescriptions", "visit", variables.visitId] });
      await queryClient.invalidateQueries({ queryKey: ["prescriptions", "patient"] });
      toast.success("Prescription saved");
    },
    onError: (error: Error) => {
      toast.error("Prescription save failed", error.message);
    }
  });

  const updatePrescriptionMutation = useMutation({
    mutationFn: ({
      prescriptionId,
      values
    }: {
      prescriptionId: string;
      values: ConsultationValues;
    }) => {
      const items = values.prescriptionItems
        .filter((item) => item.medicineId?.trim())
        .map((item) => ({
          medicineId: item.medicineId!.trim(),
          quantity: 1,
          dosage: item.dosage?.trim() || undefined,
          frequency: item.frequency?.trim() || undefined,
          duration:
            typeof item.durationDays === "number" ? `${item.durationDays} day(s)` : undefined,
          instructions: item.instructions?.trim() || undefined
        }));

      return PrescriptionService.update(prescriptionId, items);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["prescriptions", "visit", currentVisitQuery.data?.id] });
      await queryClient.invalidateQueries({ queryKey: ["prescriptions", "patient"] });
      toast.success("Prescription saved");
    },
    onError: (error: Error) => {
      toast.error("Prescription save failed", error.message);
    }
  });

  const completeMutation = useMutation({
    mutationFn: QueueService.complete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      toast.success("Consultation completed");
      await navigate({ to: backTo });
    },
    onError: (error: Error) => {
      toast.error("Complete failed", error.message);
    }
  });

  useEffect(() => {
    const entry = queueEntryQuery.data;
    if (!entry || autoStartAttempted.current) {
      return;
    }

    if (entry.status === "WAITING") {
      autoStartAttempted.current = true;
      startMutation.mutate(entry.id);
    }
  }, [queueEntryQuery.data, startMutation]);

  useEffect(() => {
    const entry = queueEntryQuery.data;
    if (!entry) {
      return;
    }

    const existingPrescription = latestPrescriptionForDisplay;
    const currentPrescriptionItems = form.getValues("prescriptionItems");
    const hasLocalPrescriptionItems = currentPrescriptionItems.some((item) =>
      Boolean(item.medicineId?.trim())
    );

    const nextPrescriptionItems = existingPrescription?.items?.length
      ? existingPrescription.items.map((item) => ({
          medicineId: item.medicineId,
          dosage: item.dosage ?? "",
          frequency: item.frequency ?? "",
          durationDays: Number.parseInt(item.duration ?? "", 10) || undefined,
          instructions: item.instructions ?? ""
        }))
      : hasLocalPrescriptionItems
        ? currentPrescriptionItems
        : [
            {
              medicineId: "",
              dosage: "",
              frequency: "",
              durationDays: undefined,
              instructions: ""
            }
          ];

    form.reset({
      doctorId: entry.doctorId,
      symptoms: currentVisitQuery.data?.symptoms ?? "",
      diagnosis: currentVisitQuery.data?.diagnosis ?? "",
      notes: currentVisitQuery.data?.notes ?? "",
      bloodPressure: currentVisitQuery.data?.bloodPressure ?? "",
      pulse: currentVisitQuery.data?.pulse,
      temperature: currentVisitQuery.data?.temperature,
      weight: currentVisitQuery.data?.weight,
      prescriptionItems: nextPrescriptionItems
    });
  }, [form, queueEntryQuery.data, currentVisitQuery.data, latestPrescriptionForDisplay]);

  useEffect(() => {
    if (!queueEntryQuery.data || queueEntryQuery.data.status !== "IN_PROGRESS") {
      return;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [queueEntryQuery.data]);

  const queueStatus = queueEntryQuery.data?.status;
  const canAmendCompleted = amendMode && queueStatus === "COMPLETED";
  const readOnly = queueStatus === "CANCELLED" || (queueStatus === "COMPLETED" && !canAmendCompleted);
  const showCompleteAction = !canAmendCompleted;

  const medicineOptions = useMemo(
    () =>
      (medicinesQuery.data ?? [])
        .filter((medicine) => medicine.status === "ACTIVE")
        .map((medicine) => ({
          value: medicine.id,
          label: `${medicine.name}${medicine.isLowStock ? " (Low stock)" : ""}`
        })),
    [medicinesQuery.data]
  );

  const doctorOptions = useMemo(
    () =>
      queueEntryQuery.data
        ? [{ value: queueEntryQuery.data.doctorId, label: queueEntryQuery.data.doctorName }]
        : [],
    [queueEntryQuery.data]
  );

  const elapsed = useMemo(() => {
    const entry = queueEntryQuery.data;
    if (!entry) {
      return "00:00:00";
    }

    const start = new Date(entry.startedAt ?? entry.createdAt).getTime();
    const totalSeconds = Math.max(0, Math.floor((now - start) / 1000));
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  }, [now, queueEntryQuery.data]);

  const pageLoading =
    queueEntryQuery.isLoading ||
    patientQuery.isLoading ||
    visitsQuery.isLoading ||
    medicinesQuery.isLoading;

  const actionBusy =
    startMutation.isPending ||
    saveVisitMutation.isPending ||
    createPrescriptionMutation.isPending ||
    updatePrescriptionMutation.isPending ||
    completeMutation.isPending;

  const prescriptionCount =
    form.watch("prescriptionItems")?.filter((item) => item.medicineId?.trim()).length ?? 0;

  const handleSaveVisit = form.handleSubmit(async (values) => {
    if (readOnly) {
      return;
    }

    const savedVisit = await saveVisitMutation.mutateAsync(values);
    const prescriptionItems = values.prescriptionItems.filter((item) => item.medicineId?.trim());
    if (prescriptionItems.length === 0) {
      return;
    }

    if (editablePrescription?.id) {
      await updatePrescriptionMutation.mutateAsync({
        prescriptionId: editablePrescription.id,
        values
      });
      return;
    }

    const hasDispensedPrescription = (currentVisitPrescriptionsQuery.data ?? []).some(
      (prescription) => prescription.status === "DISPENSED"
    );
    await createPrescriptionMutation.mutateAsync({ visitId: savedVisit.id, values });
    if (hasDispensedPrescription) {
      toast.success("Correction prescription created");
    }
  });

  const handleComplete = form.handleSubmit(async (values) => {
    if (readOnly) {
      return;
    }
    if (queueEntryQuery.data?.status === "COMPLETED") {
      toast.error("Consultation already completed");
      return;
    }

    const validationMessage = validateCompleteConsultation(values);
    if (validationMessage) {
      toast.error("Cannot complete consultation", validationMessage);
      return;
    }

    const savedVisit = await saveVisitMutation.mutateAsync(values);
    const prescriptionItems = values.prescriptionItems.filter((item) => item.medicineId?.trim());

    if (prescriptionItems.length > 0) {
      if (editablePrescription?.id) {
        await updatePrescriptionMutation.mutateAsync({
          prescriptionId: editablePrescription.id,
          values
        });
      } else {
        const hasDispensedPrescription = (currentVisitPrescriptionsQuery.data ?? []).some(
          (prescription) => prescription.status === "DISPENSED"
        );
        await createPrescriptionMutation.mutateAsync({ visitId: savedVisit.id, values });
        if (hasDispensedPrescription) {
          toast.success("Correction prescription created");
        }
      }
    }

    await completeMutation.mutateAsync(queueEntryQuery.data!.id);
  });

  return {
    activeTab,
    setActiveTab,
    queueEntryQuery,
    patientQuery,
    visitsQuery,
    medicinesQuery,
    patientPrescriptionsQuery,
    form,
    prescriptionFieldArray,
    readOnly,
    showCompleteAction,
    doctorOptions,
    medicineOptions,
    elapsed,
    pageLoading,
    actionBusy,
    prescriptionCount,
    handleSaveVisit,
    handleComplete,
    handleBack: () => navigate({ to: backTo }),
    backLabel: backTo === "/queue" ? "Back to Queue" : "Back to Consultation"
  };
}
