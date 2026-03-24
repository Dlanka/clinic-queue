import { createFileRoute } from "@tanstack/react-router";
import { ConsultationWorkspacePage } from "@/features/consultation";

export const Route = createFileRoute("/consultation/")({
  component: ConsultationWorkspacePage
});
