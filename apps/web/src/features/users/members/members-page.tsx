import { useMemo, useState } from "react";
import {
  MemberFormModal,
  MembersPageHeader,
  MembersStatsGrid,
  MembersTableCard
} from "./components";
import { MembersPageProvider, useMembersPageContext } from "./context/members-page.context";
import { useMembersData } from "./hooks";

export function MembersPage() {
  return (
    <MembersPageProvider>
      <MembersPageContent />
    </MembersPageProvider>
  );
}

function MembersPageContent() {
  const { modalOpen, editingMember, openCreateModal, openEditModal, closeModal } =
    useMembersPageContext();
  const { rows, isBusy, membersQuery, deleteMutation, resetPasswordMutation, submitMember } =
    useMembersData({
      onSettledSuccess: closeModal
    });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INVITED" | "DISABLED">(
    "ALL"
  );
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
        row.email.toLowerCase().includes(normalizedTerm) ||
        row.name.toLowerCase().includes(normalizedTerm) ||
        row.roles.some((role) => role.toLowerCase().includes(normalizedTerm))
      );
    });
  }, [rows, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((row) => row.status === "ACTIVE").length,
      invited: rows.filter((row) => row.status === "INVITED").length,
      disabled: rows.filter((row) => row.status === "DISABLED").length
    }),
    [rows]
  );

  return (
    <div className="space-y-5">
      <MembersPageHeader onCreate={openCreateModal} />

      <MembersStatsGrid
        total={stats.total}
        active={stats.active}
        invited={stats.invited}
        disabled={stats.disabled}
      />

      <MembersTableCard
        allRows={rows}
        rows={filteredRows}
        selectedStatus={statusFilter}
        searchTerm={searchTerm}
        isLoading={membersQuery.isLoading}
        isDeleting={deleteMutation.isPending}
        isResetting={resetPasswordMutation.isPending}
        dataUpdatedAt={membersQuery.dataUpdatedAt}
        onStatusChange={setStatusFilter}
        onSearch={setSearchTerm}
        onRefresh={() => membersQuery.refetch()}
        onEdit={openEditModal}
        onDelete={(memberId) => deleteMutation.mutate(memberId)}
        onResetPassword={(memberId) => resetPasswordMutation.mutate(memberId)}
      />

      <MemberFormModal
        open={modalOpen}
        member={editingMember}
        loading={isBusy}
        onClose={closeModal}
        onSubmit={(values) => submitMember({ member: editingMember, values })}
      />
    </div>
  );
}
