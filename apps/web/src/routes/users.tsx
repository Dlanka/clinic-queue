import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import type { MultiValue } from "react-select";
import { APP_ROLES, type AppRole } from "@/config/roles";
import { MemberService, type Member } from "@/services/member.service";
import {
  Badge,
  BaseModal,
  Button,
  Card,
  FieldGroup,
  Input,
  Select,
  Table,
  useToast
} from "@/components/ui";
import { rootRoute } from "./root";

const membersQueryKey = ["members"];

const roleOptions = APP_ROLES.map((role) => ({
  value: role,
  label: role.replaceAll("_", " ")
}));

const memberFormSchema = z.object({
  email: z.string().email("Valid email is required"),
  roles: z.array(z.enum(APP_ROLES)).min(1, "Select at least one role"),
  status: z.enum(["ACTIVE", "DISABLED"])
});

type MemberForm = z.infer<typeof memberFormSchema>;

const memberFormResolver: Resolver<MemberForm> = async (values) => {
  const parsed = memberFormSchema.safeParse(values);

  if (parsed.success) {
    return { values: parsed.data, errors: {} };
  }

  const errors = parsed.error.issues.reduce<Record<string, { type: string; message: string }>>(
    (acc, issue) => {
      const fieldName = String(issue.path[0] ?? "root");
      acc[fieldName] = { type: "manual", message: issue.message };
      return acc;
    },
    {}
  );

  return { values: {}, errors: errors as never };
};

export const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "users",
  component: MembersPage
});

function MembersPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const membersQuery = useQuery({
    queryKey: membersQueryKey,
    queryFn: MemberService.list
  });

  const createMutation = useMutation({
    mutationFn: MemberService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast.success("Member created");
      setModalOpen(false);
      setEditingMember(null);
    },
    onError: (error: Error) => {
      toast.error("Create failed", error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { roles: AppRole[]; isActive: boolean } }) =>
      MemberService.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast.success("Member updated");
      setModalOpen(false);
      setEditingMember(null);
    },
    onError: (error: Error) => {
      toast.error("Update failed", error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: MemberService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey });
      toast.success("Member deleted");
    },
    onError: (error: Error) => {
      toast.error("Delete failed", error.message);
    }
  });

  const rows = useMemo(() => membersQuery.data ?? [], [membersQuery.data]);
  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5">
      <section className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-95">Members</h1>
          <p className="text-sm text-neutral-80">Manage tenant memberships and role assignments.</p>
        </div>
        <Button
          startIconName="plus"
          onClick={() => {
            setEditingMember(null);
            setModalOpen(true);
          }}
        >
          New Member
        </Button>
      </section>

      <Card>
        <Card.Header
          title="Memberships"
          subtitle={`${rows.length} member${rows.length === 1 ? "" : "s"}`}
          iconName="user"
          iconClassName="bg-tertiary-soft text-tertiary"
        />
        <Card.Body>
          <Table
            columns={[
              {
                key: "email",
                header: "Email",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-neutral-95">{row.email}</p>
                    <p className="text-xs text-neutral-70">{row.name}</p>
                  </div>
                )
              },
              {
                key: "roles",
                header: "Roles",
                render: (row) => (
                  <div className="flex flex-wrap gap-1.5">
                    {row.roles.map((role) => (
                      <Badge key={role} tone="info">
                        {role.replaceAll("_", " ")}
                      </Badge>
                    ))}
                  </div>
                )
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <Badge tone={row.status === "ACTIVE" ? "success" : "danger"}>
                    {row.status}
                  </Badge>
                )
              },
              {
                key: "actions",
                header: "Actions",
                render: (row) => (
                  <div className="flex gap-2">
                    <Button
                      intent="ghost"
                      size="sm"
                      className="!px-2"
                      onClick={() => {
                        setEditingMember(row);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      intent="ghost"
                      size="sm"
                      className="!px-2 text-danger hover:bg-danger-soft"
                      onClick={() => deleteMutation.mutate(row.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
            rows={rows}
            getRowId={(row) => row.id}
            emptyMessage={membersQuery.isLoading ? "Loading members..." : "No members found."}
          />
        </Card.Body>
      </Card>

      <MemberFormModal
        open={modalOpen}
        member={editingMember}
        loading={isBusy}
        onClose={() => {
          setModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={(data) => {
          if (editingMember) {
            updateMutation.mutate({
              id: editingMember.id,
              payload: {
                roles: data.roles,
                isActive: data.status === "ACTIVE"
              }
            });
            return;
          }

          createMutation.mutate({
            email: data.email,
            roles: data.roles,
            isActive: data.status === "ACTIVE"
          });
        }}
      />
    </div>
  );
}

function MemberFormModal({
  open,
  member,
  loading,
  onClose,
  onSubmit
}: {
  open: boolean;
  member: Member | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: MemberForm) => void;
}) {
  const defaultStatus: "ACTIVE" | "DISABLED" =
    member?.status === "ACTIVE" ? "ACTIVE" : "DISABLED";

  const form = useForm<MemberForm>({
    resolver: memberFormResolver,
    defaultValues: {
      email: member?.email ?? "",
      roles: member?.roles ?? ["RECEPTION"],
      status: defaultStatus
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      email: member?.email ?? "",
      roles: member?.roles ?? ["RECEPTION"],
      status: member?.status === "ACTIVE" ? "ACTIVE" : "DISABLED"
    });
  }, [form, member, open]);

  return (
    <BaseModal
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
                    (nextValue as MultiValue<{ value: AppRole; label: string }>).map(
                      (item) => item.value
                    )
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
    </BaseModal>
  );
}
