import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { PatientsPage } from "@/features/patients";

export const Route = createFileRoute("/patients")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]}>
      <PatientsPage />
    </RoleGate>
  )
});
