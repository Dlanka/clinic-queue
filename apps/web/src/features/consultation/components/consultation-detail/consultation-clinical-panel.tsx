import type { UseFormRegister } from "react-hook-form";
import type { Prescription } from "@/services/prescription.service";
import type { Visit } from "@/services/visit.service";
import type { ConsultationValues } from "@/features/queue/schemas/consultation.schema";
import { ConsultationFormCard } from "./consultation-form-card";
import { ConsultationQuickHistoryCard } from "./consultation-quick-history-card";

interface ConsultationClinicalPanelProps {
  register: UseFormRegister<ConsultationValues>;
  patientName: string;
  visits: Visit[];
  prescriptions: Prescription[];
  historyLoading: boolean;
  queueNotes?: string;
  readOnly: boolean;
}

export function ConsultationClinicalPanel({
  register,
  patientName,
  visits,
  prescriptions,
  historyLoading,
  queueNotes,
  readOnly
}: ConsultationClinicalPanelProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <ConsultationQuickHistoryCard
        patientName={patientName}
        visits={visits}
        prescriptions={prescriptions}
        historyLoading={historyLoading}
        queueNotes={queueNotes}
      />

      <ConsultationFormCard register={register} readOnly={readOnly} />
    </div>
  );
}
