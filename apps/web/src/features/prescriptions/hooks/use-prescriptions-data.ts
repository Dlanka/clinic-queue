import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { PrescriptionService } from "@/services/prescription.service";
import { prescriptionsQueryKey } from "../store/prescriptions.store";

type UsePrescriptionsDataParams = {
  selectedStatus: "ALL" | "PRESCRIBED" | "DISPENSED";
  selectedDateFilter: "TODAY" | "ALL" | string;
  searchTerm: string;
};

export function usePrescriptionsData({
  selectedStatus,
  selectedDateFilter,
  searchTerm
}: UsePrescriptionsDataParams) {
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
        if (selectedDateFilter === "TODAY" && !isToday(new Date(row.createdAt))) {
          return false;
        }

        if (
          selectedDateFilter !== "TODAY" &&
          selectedDateFilter !== "ALL" &&
          format(new Date(row.createdAt), "yyyy-MM-dd") !== selectedDateFilter
        ) {
          return false;
        }

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
    [allRows, normalizedTerm, selectedDateFilter, selectedStatus]
  );

  const dateFilterOptions = useMemo(() => {
    const todayValue = format(new Date(), "yyyy-MM-dd");
    const pendingByDate = new Map<string, number>();

    for (const row of allRows) {
      if (row.status !== "PRESCRIBED") {
        continue;
      }

      const dateValue = format(new Date(row.createdAt), "yyyy-MM-dd");
      pendingByDate.set(dateValue, (pendingByDate.get(dateValue) ?? 0) + 1);
    }

    const otherPendingDates = Array.from(pendingByDate.entries())
      .filter(([dateValue]) => dateValue !== todayValue)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateValue, count]) => ({
        value: dateValue,
        label: `${format(new Date(dateValue), "MMM d, yyyy")} (${count} pending)`
      }));

    return [
      { value: "TODAY", label: "Today" },
      { value: "ALL", label: "All Dates" },
      ...otherPendingDates
    ];
  }, [allRows]);

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
    dateFilterOptions,
    counts,
    prescriptionsQuery,
    dispenseMutation
  };
}
