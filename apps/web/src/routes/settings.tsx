import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { SettingsPage } from "@/features/settings/settings-page";

export const Route = createFileRoute("/settings")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN"]}>
      <SettingsPage />
    </RoleGate>
  )
});

