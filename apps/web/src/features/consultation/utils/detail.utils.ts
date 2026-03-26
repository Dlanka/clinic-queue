import type { Resolver } from "react-hook-form";
import type { ConsultationValues } from "@/features/queue/schemas/consultation.schema";
import { consultationSchema } from "@/features/queue/schemas/consultation.schema";

export const consultationResolver: Resolver<ConsultationValues> = async (values) => {
  const parsed = consultationSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (accumulator, issue) => {
      const fieldName = String(issue.path.join(".") || "root");
      accumulator[fieldName] = { type: "manual", message: issue.message };
      return accumulator;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

export function initialConsultationValues(doctorId = ""): ConsultationValues {
  return {
    doctorId,
    symptoms: "",
    diagnosis: "",
    notes: "",
    bloodPressure: "",
    pulse: undefined,
    temperature: undefined,
    weight: undefined,
    prescriptionItems: [
      {
        medicineId: "",
        dosage: "",
        frequency: "",
        durationDays: undefined,
        instructions: ""
      }
    ]
  };
}

export function buildVisitPayload(values: ConsultationValues, queueId: string) {
  const symptoms = values.symptoms?.trim();
  const notes = values.notes?.trim();

  return {
    doctorId: values.doctorId,
    queueEntryId: queueId,
    symptoms: symptoms || notes || "Draft consultation",
    diagnosis: values.diagnosis?.trim() || undefined,
    notes: notes || undefined,
    bloodPressure: values.bloodPressure?.trim() || undefined,
    pulse: values.pulse,
    temperature: values.temperature,
    weight: values.weight
  };
}

export function calculateAgeLabel(dob?: string) {
  if (!dob) {
    return "-";
  }

  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) {
    return "-";
  }

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return `${age} yrs`;
}

export function formatGenderLabel(gender?: string) {
  if (!gender) {
    return "-";
  }

  return gender.charAt(0) + gender.slice(1).toLowerCase();
}
