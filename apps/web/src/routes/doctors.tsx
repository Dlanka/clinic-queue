import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { DoctorsPage } from "@/features/doctors";

export const Route = createFileRoute("/doctors")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN"]}>
      <DoctorsPage />
    </RoleGate>
  )
});
