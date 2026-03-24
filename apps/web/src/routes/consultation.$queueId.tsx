import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { RoleGate } from "@/components/role-gate";
import { ConsultationDetailPage } from "@/features/consultation/pages/consultation-detail-page";

export const Route = createFileRoute("/consultation/$queueId")({
  validateSearch: z.object({
    amend: z.boolean().optional()
  }),
  component: ConsultationDetailRouteComponent
});

function ConsultationDetailRouteComponent() {
  const { queueId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <RoleGate allowedRoles={["DOCTOR"]}>
      <ConsultationDetailPage queueId={queueId} backTo="/consultation" amendMode={Boolean(search.amend)} />
    </RoleGate>
  );
}


