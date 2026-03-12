import { createFileRoute } from "@tanstack/react-router";
import { PrescriptionsPage } from "@/features/prescriptions";

export const Route = createFileRoute("/prescriptions")({
  component: PrescriptionsPage
});
