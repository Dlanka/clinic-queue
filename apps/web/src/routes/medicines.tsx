import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { MedicinesPage } from "@/features/medicines";

export const Route = createFileRoute("/medicines")({
  component: () => (
    <RoleGate allowedRoles={["ADMIN", "RECEPTION", "DOCTOR", "NURSE", "PHARMACY_STAFF"]}>
      <MedicinesPage />
    </RoleGate>
  )
});
