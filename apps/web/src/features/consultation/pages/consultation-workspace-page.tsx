import { format } from "date-fns";
import { Badge, PageHeader } from "@/components/ui";
import { CurrentConsultationCard } from "../components/consultation-workspace/current-consultation-card";
import { RecentConsultationsCard } from "../components/consultation-workspace/recent-consultations-card";
import { WaitingPatientsList } from "../components/consultation-workspace/waiting-patients-list";
import { useConsultationWorkspace } from "../hooks/consultation-workspace/use-consultation-workspace";

export function ConsultationWorkspacePage() {
  const workspace = useConsultationWorkspace();

  if (workspace.meQuery.isLoading || workspace.queueQuery.isLoading) {
    return (
      <div className="py-8 text-center text-sm text-neutral-70">
        Loading consultation workspace...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Consultation"
        subtitle={`Today's patients and active consultation - ${format(new Date(), "MMM d, yyyy")}`}
        iconName="activity"
        action={
          <div className="inline-flex items-center gap-2 rounded-full border border-subtle px-3 py-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary-soft text-2xs font-bold text-primary">
              {workspace.doctorInitials}
            </span>
            <div className="leading-tight space-y-0.5">
              <p className="text-xs font-semibold text-neutral-95">{workspace.doctorDisplayName}</p>
              <p className="text-2xs text-neutral-70">Doctor Workspace</p>
            </div>
          </div>
        }
      />

      <CurrentConsultationCard
        entry={workspace.currentEntry}
        patientGender={workspace.currentPatient?.gender}
        patientAge={workspace.currentPatientAge}
        onContinue={workspace.handleOpenConsultation}
      />

      <div className="grid gap-5 xl:items-start xl:grid-cols-[minmax(0,1fr)_320px]">
        <WaitingPatientsList
          rows={workspace.waitingRows}
          isLoading={workspace.queueQuery.isLoading}
          actionBusy={workspace.startMutation.isPending}
          onStart={workspace.handleStart}
          updatedAt={workspace.queueQuery.dataUpdatedAt}
          onRefresh={() => workspace.queueQuery.refetch()}
          headerAction={
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning" size="sm" iconName="clock3">
                {workspace.waitingRows.length} waiting
              </Badge>
              {workspace.priorityCount > 0 ? (
                <Badge tone="danger" size="sm" iconName="zap">
                  {workspace.priorityCount} priority
                </Badge>
              ) : null}
            </div>
          }
        />

        <RecentConsultationsCard rows={workspace.recentCompletedRows} />
      </div>
    </div>
  );
}
