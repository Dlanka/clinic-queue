import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { Badge, Button, Card, FieldGroup, Select, Table, Textarea } from "@/components/ui";
import type { Doctor } from "@/services/doctor.service";
import type { Patient } from "@/services/patient.service";
import type { Visit } from "@/services/visit.service";
import type { VisitFormValues } from "../schemas/visit-form.schema";
import { useVisitForm } from "../hooks";

type PatientDetailCardProps = {
  patient: Patient | null;
  visits: Visit[];
  visitsLoading: boolean;
  doctors: Doctor[];
  visitSaving: boolean;
  selectedPatientId: string | null;
  onSubmitVisit: (values: VisitFormValues) => void;
  onOpenPrescriptionBuilder: (visit: Visit) => void;
};

export function PatientDetailCard({
  patient,
  visits,
  visitsLoading,
  doctors,
  visitSaving,
  selectedPatientId,
  onSubmitVisit,
  onOpenPrescriptionBuilder
}: PatientDetailCardProps) {
  const form = useVisitForm(selectedPatientId);

  if (!patient) {
    return (
      <Card>
        <Card.Header
          title="Patient Detail"
          subtitle="Select a patient to view profile and visits"
          iconName="clipboardList"
          iconClassName="bg-primary-soft text-primary"
        />
        <Card.Body>
          <p className="text-sm text-neutral-80">No patient selected.</p>
        </Card.Body>
      </Card>
    );
  }

  const doctorOptions = doctors.map((doctor) => ({ value: doctor.id, label: doctor.name }));

  return (
    <Card>
      <Card.Header
        title={patient.fullName}
        subtitle={`${patient.gender ?? "N/A"} • ${patient.phone ?? "No phone"}`}
        iconName="user"
        iconClassName="bg-primary-soft text-primary"
      />
      <Card.Body className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-70">Status</p>
            <Badge tone={patient.status === "ACTIVE" ? "success" : "danger"}>{patient.status}</Badge>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-neutral-70">Date Of Birth</p>
            <p className="text-sm text-neutral-95">
              {patient.dateOfBirth ? format(new Date(patient.dateOfBirth), "MMMM d, yyyy") : "N/A"}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-neutral-variant-90/40 p-4">
          <h3 className="text-base font-bold text-neutral-95">Create Visit</h3>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmitVisit)}>
            <FieldGroup id="visit-doctor" label="Doctor" error={form.formState.errors.doctorId?.message}>
              <Controller
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <Select
                    inputId="visit-doctor"
                    options={doctorOptions}
                    placeholder="Select doctor"
                    value={doctorOptions.find((option) => option.value === field.value) ?? null}
                    onChange={(nextValue) => field.onChange(nextValue?.value ?? "")}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup id="visit-symptoms" label="Symptoms" error={form.formState.errors.symptoms?.message}>
              <Textarea id="visit-symptoms" rows={3} {...form.register("symptoms")} />
            </FieldGroup>

            <FieldGroup id="visit-diagnosis" label="Diagnosis">
              <Textarea id="visit-diagnosis" rows={2} {...form.register("diagnosis")} />
            </FieldGroup>

            <FieldGroup id="visit-notes" label="Notes">
              <Textarea id="visit-notes" rows={2} {...form.register("notes")} />
            </FieldGroup>

            <Button type="submit" startIconName="plus" disabled={visitSaving}>
              Save Visit
            </Button>
          </form>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-neutral-95">Visit History</h3>
          <Table
            columns={[
              {
                key: "visitedAt",
                header: "Date",
                render: (row) => (
                  <span className="text-neutral-90">{format(new Date(row.visitedAt), "MMM d, yyyy p")}</span>
                )
              },
              {
                key: "doctor",
                header: "Doctor",
                render: (row) => <span className="font-semibold text-neutral-95">{row.doctorName}</span>
              },
              {
                key: "symptoms",
                header: "Symptoms",
                render: (row) => <span className="text-neutral-90">{row.symptoms}</span>
              },
              {
                key: "actions",
                header: "Actions",
                render: (row) => (
                  <Button size="sm" intent="ghost" className="!px-2" onClick={() => onOpenPrescriptionBuilder(row)}>
                    Build Rx
                  </Button>
                )
              }
            ]}
            rows={visits}
            getRowId={(row) => row.id}
            emptyMessage={visitsLoading ? "Loading visits..." : "No visits yet."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
