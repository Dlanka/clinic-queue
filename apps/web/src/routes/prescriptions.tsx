import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { PrescriptionsPage } from "@/features/prescriptions";

export const Route = createFileRoute("/prescriptions")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN", "RECEPTION", "DOCTOR", "NURSE", "PHARMACY_STAFF"]}>
      <PrescriptionsPage />
    </RoleGate>
  )
});
