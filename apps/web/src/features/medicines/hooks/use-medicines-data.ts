import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import {
  MedicineService,
  type CreateMedicinePayload,
  type Medicine,
  type UpdateMedicinePayload
} from "@/services/medicine.service";
import type { MedicineFormValues } from "../schemas/medicine-form.schema";
import { medicinesQueryKey } from "../store/medicines.store";

type SubmitPayload = {
  medicine: Medicine | null;
  values: MedicineFormValues;
};

type UseMedicinesDataParams = {
  onSettledSuccess: () => void;
};

export function useMedicinesData({ onSettledSuccess }: UseMedicinesDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const medicinesQuery = useQuery({
    queryKey: medicinesQueryKey,
    queryFn: MedicineService.list
  });

  const createMutation = useMutation({
    mutationFn: MedicineService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: medicinesQueryKey });
      toast.success("Medicine created");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Create failed", error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMedicinePayload }) =>
      MedicineService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: medicinesQueryKey });
      toast.success("Medicine updated");
      onSettledSuccess();
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: MedicineService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: medicinesQueryKey });
      toast.success("Medicine deleted");
    },
    onError: (error: Error) => {
      toast.error("Delete failed", error.message);
    }
  });

  const rows = useMemo(() => medicinesQuery.data ?? [], [medicinesQuery.data]);
  const isBusy = createMutation.isPending || updateMutation.isPending;

  const submitMedicine = ({ medicine, values }: SubmitPayload) => {
    const payload: CreateMedicinePayload = {
      ...values,
      category: values.category || undefined,
      unit: values.unit || undefined,
      price: typeof values.price === "number" ? values.price : undefined
    };

    if (medicine) {
      updateMutation.mutate({ id: medicine.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  return {
    rows,
    isBusy,
    medicinesQuery,
    deleteMutation,
    submitMedicine
  };
}
