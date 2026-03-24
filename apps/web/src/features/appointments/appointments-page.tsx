import { useMemo, useState } from "react";
import type { AppointmentStatus } from "@/services/appointment.service";
import {
  AppointmentFormModal,
  AppointmentsPageHeader,
  AppointmentsTableCard
} from "./components";
import {
  AppointmentsPageProvider,
  useAppointmentsPageContext
} from "./context/appointments-page.context";
import { useAppointmentsData } from "./hooks";

export function AppointmentsPage() {
  return (
    <AppointmentsPageProvider>
      <AppointmentsPageContent />
    </AppointmentsPageProvider>
  );
}

function AppointmentsPageContent() {
  const { modalOpen, editingAppointmentId, openCreateModal, openEditModal, closeModal } =
    useAppointmentsPageContext();
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppointmentStatus>("ALL");

  const {
    rows,
    doctorOptions,
    patientOptions,
    isSubmitting,
    appointmentsQuery,
    doctorsQuery,
    patientsQuery,
    deleteMutation,
    submitAppointment
  } = useAppointmentsData({
    statusFilter,
    onSettledSuccess: closeModal
  });

  const editingAppointment = useMemo(
    () => rows.find((row) => row.id === editingAppointmentId) ?? null,
    [editingAppointmentId, rows]
  );

  return (
    <div className="space-y-5">
      <AppointmentsPageHeader onCreate={openCreateModal} />

      <AppointmentsTableCard
        rows={rows}
        isLoading={appointmentsQuery.isLoading}
        statusFilter={statusFilter}
        isDeleting={deleteMutation.isPending}
        onStatusChange={setStatusFilter}
        onEdit={openEditModal}
        onDelete={(appointmentId) => deleteMutation.mutate(appointmentId)}
      />

      <AppointmentFormModal
        open={modalOpen}
        appointment={editingAppointment}
        doctorOptions={doctorOptions}
        patientOptions={patientOptions}
        doctorsLoading={doctorsQuery.isLoading}
        patientsLoading={patientsQuery.isLoading}
        loading={isSubmitting}
        onClose={closeModal}
        onSubmit={(values) => submitAppointment({ appointment: editingAppointment, values })}
      />
    </div>
  );
}
