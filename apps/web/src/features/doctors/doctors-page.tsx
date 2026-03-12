import { DoctorFormModal, DoctorsPageHeader, DoctorsTableCard } from "./components";
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

  return (
    <div className="space-y-5">
      <DoctorsPageHeader onCreate={openCreateModal} />

      <DoctorsTableCard
        rows={rows}
        isLoading={doctorsQuery.isLoading}
        isDeleting={deleteMutation.isPending}
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
