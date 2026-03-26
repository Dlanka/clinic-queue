import { Button, Card } from "@/components/ui";
import { ConsultationDetailActionBar } from "@/features/consultation/components/consultation-detail/consultation-detail-action-bar";
import { ConsultationClinicalPanel } from "@/features/consultation/components/consultation-detail/consultation-clinical-panel";
import { ConsultationDetailHeaderCard } from "@/features/consultation/components/consultation-detail/consultation-detail-header-card";
import { ConsultationPrescriptionPanel } from "@/features/consultation/components/consultation-detail/consultation-prescription-panel";
import { ConsultationDetailTabs } from "@/features/consultation/components/consultation-detail/consultation-detail-tabs";
import { useConsultationDetail } from "@/features/consultation/hooks/consultation-detail/use-consultation-detail";

interface ConsultationDetailPageProps {
  queueId: string;
  backTo?: "/queue" | "/consultation";
  amendMode?: boolean;
}

export function ConsultationDetailPage({
  queueId,
  backTo = "/consultation",
  amendMode = false
}: ConsultationDetailPageProps) {
  const detail = useConsultationDetail({ queueId, backTo, amendMode });

  if (detail.pageLoading) {
    return <div className="py-8 text-center text-sm text-neutral-70">Loading consultation...</div>;
  }

  if (!detail.queueEntryQuery.data || !detail.patientQuery.data) {
    return (
      <Card>
        <Card.Body className="p-6 text-center">
          <p className="text-sm text-neutral-70">Consultation not found.</p>
          <div className="mt-3">
            <Button
              variant="outlined"
              intent="neutral"
              startIconName="arrowRight"
              onClick={detail.handleBack}
            >
              {detail.backLabel}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ConsultationDetailHeaderCard
        entry={detail.queueEntryQuery.data}
        patient={detail.patientQuery.data}
        visits={detail.visitsQuery.data ?? []}
        elapsed={detail.elapsed}
        backLabel={detail.backLabel}
        onBack={detail.handleBack}
      />

      <div className="w-full space-y-4">
        <ConsultationDetailTabs
          activeTab={detail.activeTab}
          prescriptionCount={detail.prescriptionCount}
          onChange={detail.setActiveTab}
        />

        {detail.activeTab === "clinical" ? (
          <ConsultationClinicalPanel
            register={detail.form.register}
            patientName={detail.patientQuery.data.fullName}
            visits={detail.visitsQuery.data ?? []}
            prescriptions={detail.patientPrescriptionsQuery.data ?? []}
            historyLoading={
              detail.visitsQuery.isLoading || detail.patientPrescriptionsQuery.isLoading
            }
            queueNotes={detail.queueEntryQuery.data.notes}
            readOnly={detail.readOnly}
          />
        ) : (
          <ConsultationPrescriptionPanel
            fieldArray={detail.prescriptionFieldArray}
            medicineOptions={detail.medicineOptions}
            medicines={detail.medicinesQuery.data ?? []}
            readOnly={detail.readOnly}
          />
        )}
      </div>
      <ConsultationDetailActionBar
        readOnly={detail.readOnly}
        showComplete={detail.showCompleteAction}
        actionBusy={detail.actionBusy}
        onCancel={detail.handleBack}
        onSaveVisit={detail.handleSaveVisit}
        onComplete={detail.handleComplete}
      />
    </div>
  );
}
