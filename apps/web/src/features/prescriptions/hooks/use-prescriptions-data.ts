import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { PrescriptionService } from "@/services/prescription.service";
import { prescriptionsQueryKey } from "../store/prescriptions.store";

type UsePrescriptionsDataParams = {
  selectedStatus: "ALL" | "PRESCRIBED" | "DISPENSED";
  searchTerm: string;
};

export function usePrescriptionsData({ selectedStatus, searchTerm }: UsePrescriptionsDataParams) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const prescriptionsQuery = useQuery({
    queryKey: prescriptionsQueryKey,
    queryFn: () => PrescriptionService.list()
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

  const allRows = useMemo(() => prescriptionsQuery.data ?? [], [prescriptionsQuery.data]);
  const normalizedTerm = searchTerm.trim().toLowerCase();

  const rows = useMemo(
    () =>
      allRows.filter((row) => {
        if (selectedStatus !== "ALL" && row.status !== selectedStatus) {
          return false;
        }

        if (!normalizedTerm) {
          return true;
        }

        return (
          row.patientName.toLowerCase().includes(normalizedTerm) ||
          row.doctorName.toLowerCase().includes(normalizedTerm) ||
          row.id.toLowerCase().includes(normalizedTerm)
        );
      }),
    [allRows, normalizedTerm, selectedStatus]
  );

  const counts = useMemo(
    () => ({
      all: allRows.length,
      prescribed: allRows.filter((row) => row.status === "PRESCRIBED").length,
      dispensed: allRows.filter((row) => row.status === "DISPENSED").length,
      items: allRows.reduce((total, row) => total + row.items.length, 0)
    }),
    [allRows]
  );

  return {
    allRows,
    rows,
    counts,
    prescriptionsQuery,
    dispenseMutation
  };
}
