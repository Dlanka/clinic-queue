import { createFileRoute } from "@tanstack/react-router";
import { RoleGate } from "@/components/role-gate";
import { ConsultationDetailPage } from "@/features/consultation/pages/consultation-detail-page";

export const Route = createFileRoute("/queue/$queueId")({
  component: QueueConsultationRouteComponent
});

function QueueConsultationRouteComponent() {
  const { queueId } = Route.useParams();

  return (
    <RoleGate allowedRoles={["DOCTOR"]}>
      <ConsultationDetailPage queueId={queueId} backTo="/queue" />
    </RoleGate>
  );
}


