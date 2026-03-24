import { Outlet, createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";

export const Route = createFileRoute("/queue")({
  component: QueueRouteLayout
});

function QueueRouteLayout() {
  return (
    <RoleGate allowedRoles={["ADMIN", "RECEPTION", "DOCTOR", "NURSE"]}>
      <Outlet />
    </RoleGate>
  );
}
