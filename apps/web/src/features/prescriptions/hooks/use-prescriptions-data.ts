import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { PrescriptionService } from "@/services/prescription.service";
import { prescriptionsQueryKey } from "../store/prescriptions.store";

type UsePrescriptionsDataParams = {
  selectedStatus: "ALL" | "PRESCRIBED" | "DISPENSED";
};

export function usePrescriptionsData({ selectedStatus }: UsePrescriptionsDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const prescriptionsQuery = useQuery({
    queryKey: [...prescriptionsQueryKey, selectedStatus],
    queryFn: () =>
      PrescriptionService.list(selectedStatus === "ALL" ? undefined : selectedStatus)
  });

  const dispenseMutation = useMutation({
    mutationFn: PrescriptionService.dispense,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: prescriptionsQueryKey });
      toast.success("Prescription dispensed");
    },
    onError: (error: Error) => {
      toast.error("Dispense failed", error.message);
    }
  });

  const rows = useMemo(() => prescriptionsQuery.data ?? [], [prescriptionsQuery.data]);

  return {
    rows,
    prescriptionsQuery,
    dispenseMutation
  };
}
