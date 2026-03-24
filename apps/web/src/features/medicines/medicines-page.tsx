import { useMemo, useState } from "react";
import {
  MedicineFormModal,
  MedicinesPageHeader,
  MedicinesStatsGrid,
  MedicinesTableCard
} from "./components";
import { MedicinesPageProvider, useMedicinesPageContext } from "./context/medicines-page.context";
import { useMedicinesData } from "./hooks";

export function MedicinesPage() {
  return (
    <MedicinesPageProvider>
      <MedicinesPageContent />
    </MedicinesPageProvider>
  );
}

function MedicinesPageContent() {
  const { modalOpen, editingMedicine, openCreateModal, openEditModal, closeModal } =
    useMedicinesPageContext();

  const { rows, isBusy, medicinesQuery, deleteMutation, submitMedicine } = useMedicinesData({
    onSettledSuccess: closeModal
  });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "LOW_STOCK" | "OUT_OF_STOCK">("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter === "ACTIVE" && (row.stockQty <= 0 || row.isLowStock || row.status !== "ACTIVE")) {
        return false;
      }
      if (statusFilter === "LOW_STOCK" && !(row.isLowStock && row.stockQty > 0)) {
        return false;
      }
      if (statusFilter === "OUT_OF_STOCK" && row.stockQty > 0) {
        return false;
      }

      if (categoryFilter !== "ALL" && (row.category ?? "") !== categoryFilter) {
        return false;
      }

      if (!normalizedTerm) {
        return true;
      }

      return (
        row.name.toLowerCase().includes(normalizedTerm) ||
        (row.category ?? "").toLowerCase().includes(normalizedTerm) ||
        (row.unit ?? "").toLowerCase().includes(normalizedTerm)
      );
    });
  }, [categoryFilter, rows, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      inStock: rows.filter((row) => row.status === "ACTIVE" && !row.isLowStock && row.stockQty > 0).length,
      lowStock: rows.filter((row) => row.isLowStock && row.stockQty > 0).length,
      outOfStock: rows.filter((row) => row.stockQty <= 0).length
    }),
    [rows]
  );

  return (
    <div className="space-y-5">
      <MedicinesPageHeader onCreate={openCreateModal} />

      <MedicinesStatsGrid
        total={stats.total}
        inStock={stats.inStock}
        lowStock={stats.lowStock}
        outOfStock={stats.outOfStock}
      />

      <MedicinesTableCard
        allRows={rows}
        rows={filteredRows}
        selectedFilter={statusFilter}
        categoryFilter={categoryFilter}
        searchTerm={searchTerm}
        isLoading={medicinesQuery.isLoading}
        isDeleting={deleteMutation.isPending}
        dataUpdatedAt={medicinesQuery.dataUpdatedAt}
        onFilterChange={setStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
        onSearch={setSearchTerm}
        onRefresh={() => medicinesQuery.refetch()}
        onEdit={openEditModal}
        onDelete={(medicineId) => deleteMutation.mutate(medicineId)}
      />

      <MedicineFormModal
        open={modalOpen}
        medicine={editingMedicine}
        loading={isBusy}
        onClose={closeModal}
        onSubmit={(values) => submitMedicine({ medicine: editingMedicine, values })}
      />
    </div>
  );
}
