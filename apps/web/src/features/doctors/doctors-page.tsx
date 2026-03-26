import { useMemo, useState } from "react";
import {
  DoctorFormModal,
  DoctorsPageHeader,
  DoctorsStatsGrid,
  DoctorsTableCard
} from "./components";
import { DoctorsPageProvider, useDoctorsPageContext } from "./context/doctors-page.context";
import { useDoctorsData } from "./hooks";

export function DoctorsPage() {
  return (
    <DoctorsPageProvider>
      <DoctorsPageContent />
    </DoctorsPageProvider>
  );
}

function DoctorsPageContent() {
  const { modalOpen, editingDoctor, openCreateModal, openEditModal, closeModal } =
    useDoctorsPageContext();

  const { rows, members, isBusy, doctorsQuery, membersQuery, deleteMutation, submitDoctor } =
    useDoctorsData({
      onSettledSuccess: closeModal
    });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DISABLED">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter !== "ALL" && row.status !== statusFilter) {
        return false;
      }

      if (!normalizedTerm) {
        return true;
      }

      return (
        row.name.toLowerCase().includes(normalizedTerm) ||
        row.specialization.toLowerCase().includes(normalizedTerm) ||
        row.memberName.toLowerCase().includes(normalizedTerm) ||
        row.memberEmail.toLowerCase().includes(normalizedTerm) ||
        (row.licenseNumber ?? "").toLowerCase().includes(normalizedTerm)
      );
    });
  }, [rows, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((row) => row.status === "ACTIVE").length,
      disabled: rows.filter((row) => row.status === "DISABLED").length,
      withLicense: rows.filter((row) => Boolean(row.licenseNumber?.trim())).length
    }),
    [rows]
  );

  return (
    <div className="space-y-5">
      <DoctorsPageHeader onCreate={openCreateModal} />

      <DoctorsStatsGrid
        total={stats.total}
        active={stats.active}
        disabled={stats.disabled}
        withLicense={stats.withLicense}
      />

      <DoctorsTableCard
        allRows={rows}
        rows={filteredRows}
        selectedStatus={statusFilter}
        searchTerm={searchTerm}
        isLoading={doctorsQuery.isLoading}
        isDeleting={deleteMutation.isPending}
        dataUpdatedAt={doctorsQuery.dataUpdatedAt}
        onStatusChange={setStatusFilter}
        onSearch={setSearchTerm}
        onRefresh={() => doctorsQuery.refetch()}
        onEdit={openEditModal}
        onDelete={(doctorId) => deleteMutation.mutate(doctorId)}
      />

      <DoctorFormModal
        open={modalOpen}
        doctor={editingDoctor}
        doctors={rows}
        members={members}
        membersLoading={membersQuery.isLoading}
        loading={isBusy}
        onClose={closeModal}
        onSubmit={(values) => submitDoctor({ doctor: editingDoctor, values })}
      />
    </div>
  );
}
