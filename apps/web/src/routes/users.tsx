import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { MembersPage } from "@/features/users/members";

export const Route = createFileRoute("/users")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN"]}>
      <MembersPage />
    </RoleGate>
  )
});
