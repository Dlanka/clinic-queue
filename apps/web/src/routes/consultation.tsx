import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";

export const Route = createFileRoute("/consultation")({
  component: ConsultationRouteLayout
});

function ConsultationRouteLayout() {
  return (
    <RoleGate allowedRoles={["DOCTOR"]}>
      <Outlet />
    </RoleGate>
  );
}

