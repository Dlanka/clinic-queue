import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { Button, FieldGroup, Input, RightPanelModal, Select } from "@/components/ui";
import type { Doctor } from "@/services/doctor.service";
import type { Member } from "@/services/member.service";
import { useDoctorForm } from "../hooks";
import type { DoctorFormValues } from "../schemas/doctor-form.schema";
import { specializationOptions } from "../store/doctors.store";

type DoctorFormModalProps = {
  open: boolean;
  doctor: Doctor | null;
  doctors: Doctor[];
  members: Member[];
  membersLoading: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: DoctorFormValues) => void;
};

export function DoctorFormModal({
  open,
  doctor,
  doctors,
  members,
  membersLoading,
  loading,
  onClose,
  onSubmit
}: DoctorFormModalProps) {
  const form = useDoctorForm(open, doctor);

  const doctorMembers = useMemo(
    () =>
      members.filter((member) => member.status === "ACTIVE" && member.roles.includes("DOCTOR")),
    [members]
  );

  const usedMemberIds = useMemo(
    () =>
      new Set(
        doctors
          .filter((item) => item.memberId !== doctor?.memberId)
          .map((item) => item.memberId)
      ),
    [doctor?.memberId, doctors]
  );

  const usedMemberEmails = useMemo(
    () =>
      new Set(
        doctors
          .filter((item) => item.memberEmail && item.memberId !== doctor?.memberId)
          .map((item) => item.memberEmail.toLowerCase().trim())
      ),
    [doctor?.memberId, doctors]
  );

  const memberOptions = useMemo(() => {
    const options = doctorMembers
      .filter((member) => {
        const email = member.email.toLowerCase().trim();
        return !usedMemberIds.has(member.id) && !usedMemberEmails.has(email);
      })
      .map((member) => ({
        value: member.id,
        label: `${member.name} (${member.email})`
      }));

    if (doctor && !options.some((option) => option.value === doctor.memberId) && doctor.memberEmail) {
      options.unshift({
        value: doctor.memberId,
        label: `${doctor.memberName} (${doctor.memberEmail})`
      });
    }

    return options;
  }, [doctor, doctorMembers, usedMemberEmails, usedMemberIds]);

  return (
    <RightPanelModal
      open={open}
      title={doctor ? "Edit Doctor" : "Create Doctor"}
      description={doctor ? "Update doctor details." : "Add a new doctor to this tenant."}
      onClose={onClose}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="doctor-form" disabled={loading}>
            {doctor ? "Save Changes" : "Create Doctor"}
          </Button>
        </>
      }
    >
      <form
        id="doctor-form"
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <FieldGroup id="doctor-name" label="Doctor Name" error={form.formState.errors.name?.message}>
          <Input
            id="doctor-name"
            placeholder="Dr. Jane Doe"
            invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
        </FieldGroup>

        <FieldGroup
          id="doctor-member"
          label="Doctor Member"
          error={form.formState.errors.memberId?.message}
        >
          <Controller
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <Select
                inputId="doctor-member"
                isLoading={membersLoading}
                options={memberOptions}
                placeholder="Select a member with DOCTOR role"
                value={memberOptions.find((option) => option.value === field.value) ?? null}
                onChange={(nextValue) => field.onChange(nextValue?.value ?? "")}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup
          id="doctor-specialization"
          label="Specialization"
          error={form.formState.errors.specialization?.message}
        >
          <Controller
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <Select
                inputId="doctor-specialization"
                options={specializationOptions}
                placeholder="Select specialization"
                value={specializationOptions.find((option) => option.value === field.value) ?? null}
                onChange={(nextValue) => field.onChange(nextValue?.value ?? "")}
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="doctor-license" label="License Number">
          <Input id="doctor-license" placeholder="LIC-12345" {...form.register("licenseNumber")} />
        </FieldGroup>

        <FieldGroup id="doctor-status" label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                inputId="doctor-status"
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "DISABLED", label: "Disabled" }
                ]}
                value={
                  field.value === "ACTIVE"
                    ? { value: "ACTIVE", label: "Active" }
                    : { value: "DISABLED", label: "Disabled" }
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
      </form>
    </RightPanelModal>
  );
}

