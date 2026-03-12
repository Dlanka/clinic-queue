import type { MultiValue } from "react-select";
import { Controller } from "react-hook-form";
import type { AppRole } from "@/config/roles";
import { Button, FieldGroup, Input, RightPanelModal, Select } from "@/components/ui";
import type { Member } from "@/services/member.service";
import { useMemberForm } from "../hooks/use-member-form";
import type { MemberFormValues } from "../schemas/member-form.schema";
import { roleOptions, type RoleOption } from "../store/members.store";

type MemberFormModalProps = {
  open: boolean;
  member: Member | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: MemberFormValues) => void;
};

export function MemberFormModal({
  open,
  member,
  loading,
  onClose,
  onSubmit
}: MemberFormModalProps) {
  const form = useMemberForm(open, member);

  return (
    <RightPanelModal
      open={open}
      title={member ? "Edit Member" : "Create Member"}
      description={member ? "Update role assignments and status." : "Add a new tenant member."}
      onClose={onClose}
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="member-form" disabled={loading}>
            {member ? "Save Changes" : "Create Member"}
          </Button>
        </>
      }
    >
      <form
        id="member-form"
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
      >
        <FieldGroup id="member-email" label="Email" error={form.formState.errors.email?.message}>
          <Input
            id="member-email"
            placeholder="member@clinic.com"
            disabled={Boolean(member)}
            invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
        </FieldGroup>

        <FieldGroup id="member-roles" label="Roles" error={form.formState.errors.roles?.message}>
          <Controller
            control={form.control}
            name="roles"
            render={({ field }) => (
              <Select
                inputId="member-roles"
                isMulti
                closeMenuOnSelect={false}
                options={roleOptions}
                value={roleOptions.filter((option) => (field.value || []).includes(option.value))}
                onChange={(nextValue) =>
                  field.onChange(
                    (nextValue as MultiValue<RoleOption>).map((item) => item.value as AppRole)
                  )
                }
              />
            )}
          />
        </FieldGroup>

        <FieldGroup id="member-status" label="Status">
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select
                inputId="member-status"
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
