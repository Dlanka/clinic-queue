import { MemberFormModal, MembersPageHeader, MembersTableCard } from "./components";
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

  return (
    <div className="space-y-5">
      <MembersPageHeader onCreate={openCreateModal} />

      <MembersTableCard
        rows={rows}
        isLoading={membersQuery.isLoading}
        isDeleting={deleteMutation.isPending}
        isResetting={resetPasswordMutation.isPending}
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
