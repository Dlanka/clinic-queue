import { format } from "date-fns";
import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import type { Appointment } from "@/services/appointment.service";
import { appointmentFormSchema, type AppointmentFormValues } from "../schemas/appointment-form.schema";

const appointmentFormResolver: Resolver<AppointmentFormValues> = async (values) => {
  const parsed = appointmentFormSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (accumulator, issue) => {
      const fieldName = String(issue.path[0] ?? "root");
      accumulator[fieldName] = { type: "manual", message: issue.message };
      return accumulator;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

function toLocalInputValue(iso?: string) {
  if (!iso) {
    return "";
  }

  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm");
}

const appointmentFormDefaults: AppointmentFormValues = {
  patientId: "",
  doctorId: "",
  scheduledAtLocal: "",
  status: "SCHEDULED",
  notes: ""
};

export function useAppointmentForm(open: boolean, editingAppointment: Appointment | null) {
  const form = useForm<AppointmentFormValues>({
    resolver: appointmentFormResolver,
    defaultValues: appointmentFormDefaults
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      patientId: editingAppointment?.patientId ?? "",
      doctorId: editingAppointment?.doctorId ?? "",
      scheduledAtLocal: toLocalInputValue(editingAppointment?.scheduledAt),
      status: editingAppointment?.status ?? "SCHEDULED",
      notes: editingAppointment?.notes ?? ""
    });
  }, [editingAppointment, form, open]);

  return form;
}
