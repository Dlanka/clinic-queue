import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { AppointmentsPage } from "@/features/appointments";

export const Route = createFileRoute("/appointments")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]}>
      <AppointmentsPage />
    </RoleGate>
  )
});
