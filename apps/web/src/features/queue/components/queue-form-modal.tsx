import { useEffect } from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  FieldGroup,
  RightPanelModal,
  SectionDivider,
  SegmentedControl,
  Select,
  Switch
} from "@/components/ui";
import { iconMap } from "@/config/icons";
import type { Patient } from "@/services/patient.service";
import { useQueueForm } from "../hooks";
import type { QueueFormValues } from "../schemas/queue-form.schema";
import { QueueExistingPatientSelector } from "./queue-existing-patient-selector";
import { QueueQuickRegisterForm } from "./queue-quick-register-form";

interface QueueFormModalProps {
  open: boolean;
  loading: boolean;
  patients: Patient[];
  doctorOptions: Array<{ value: string; label: string }>;
  patientsLoading: boolean;
  doctorsLoading: boolean;
  duplicatePatients: Patient[];
  onClose: () => void;
  onSubmit: (values: QueueFormValues) => void | Promise<void>;
  onDismissDuplicateNotice: () => void;
  onUseExistingPatient: (patientId: string, values: QueueFormValues) => void;
  onCreateNewPatientAnyway: (values: QueueFormValues) => void | Promise<void>;
}

const ZapIcon = iconMap.zap;

export function QueueFormModal({
  open,
  loading,
  patients,
  doctorOptions,
  patientsLoading,
  doctorsLoading,
  duplicatePatients,
  onClose,
  onSubmit,
  onDismissDuplicateNotice,
  onUseExistingPatient,
  onCreateNewPatientAnyway
}: QueueFormModalProps) {
  const form = useQueueForm(open);
  const patientMode = form.watch("patientMode");
  const quickPhone = form.watch("quickPhone");
  const selectedPatientId = form.watch("patientId");

  useEffect(() => {
    if (patientMode !== "quick") {
      onDismissDuplicateNotice();
      return;
    }

    if (!quickPhone?.trim()) {
      onDismissDuplicateNotice();
    }
  }, [onDismissDuplicateNotice, patientMode, quickPhone]);

  return (
    <RightPanelModal
      panelClassName="rounded-none"
      open={open}
      title="Add Queue Entry"
      description="Select existing patient or quick register"
      headerContent={
        <SegmentedControl
          value={patientMode}
          onValueChange={(nextValue) =>
            form.setValue("patientMode", nextValue as QueueFormValues["patientMode"])
          }
        >
          <SegmentedControl.Item value="existing" iconName="user">
            Select Existing
          </SegmentedControl.Item>

          <SegmentedControl.Item value="quick" iconName="userPlus">
            Quick Register
          </SegmentedControl.Item>
        </SegmentedControl>
      }
      onClose={onClose}
      footer={
        <>
          <Button variant="outlined" intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="queue-form" disabled={loading} startIconName="plus">
            Add Entry
          </Button>
        </>
      }
    >
      <form id="queue-form" className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <>
          {patientMode === "existing" ? (
            <QueueExistingPatientSelector
              patients={patients}
              patientsLoading={patientsLoading}
              selectedPatientId={selectedPatientId}
              error={form.formState.errors.patientId?.message}
              onSelectPatient={(patientId) =>
                form.setValue("patientId", patientId, {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }
            />
          ) : (
            <QueueQuickRegisterForm
              form={form}
              loading={loading}
              duplicatePatients={duplicatePatients}
              onDismissDuplicateNotice={onDismissDuplicateNotice}
              onUseExistingPatient={onUseExistingPatient}
              onCreateNewPatientAnyway={onCreateNewPatientAnyway}
            />
          )}
        </>

        <SectionDivider label="Visit Details" />

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FieldGroup
              id="queue-doctor"
              label="Doctor *"
              error={form.formState.errors.doctorId?.message}
            >
              <Controller
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <Select
                    inputId="queue-doctor"
                    placeholder={doctorsLoading ? "Loading doctors..." : "Select doctor..."}
                    options={doctorOptions}
                    value={doctorOptions.find((option) => option.value === field.value) ?? null}
                    onChange={(nextValue) => field.onChange(nextValue?.value ?? "")}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup id="queue-visit-type" label="Visit Type">
              <Controller
                control={form.control}
                name="visitType"
                render={({ field }) => (
                  <Select
                    inputId="queue-visit-type"
                    options={[
                      { value: "CONSULTATION", label: "Consultation" },
                      { value: "EMERGENCY", label: "Emergency" }
                    ]}
                    value={
                      field.value === "EMERGENCY"
                        ? { value: "EMERGENCY", label: "Emergency" }
                        : { value: "CONSULTATION", label: "Consultation" }
                    }
                    onChange={(nextValue) => {
                      if (!nextValue) {
                        return;
                      }

                      field.onChange(nextValue.value);
                    }}
                  />
                )}
              />
            </FieldGroup>
          </div>

          <Controller
            control={form.control}
            name="isPriority"
            render={({ field }) => {
              const checked = Boolean(field.value);

              return (
                <div
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-warning/45 bg-warning-soft/40 px-4 py-3"
                  onClick={() => field.onChange(!checked)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      field.onChange(!checked);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-warning-soft text-warning">
                      <ZapIcon size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-95">Priority Patient</p>
                      <p className="text-xs text-neutral-70">
                        Jump to front of queue - use for urgent cases
                      </p>
                    </div>
                  </div>

                  <Switch
                    intent="warning"
                    checked={checked}
                    onCheckedChange={field.onChange}
                    onClick={(event) => event.stopPropagation()}
                    label=""
                    aria-label="Priority patient"
                    disabled={loading}
                  />
                </div>
              );
            }}
          />
        </div>
      </form>
    </RightPanelModal>
  );
}
