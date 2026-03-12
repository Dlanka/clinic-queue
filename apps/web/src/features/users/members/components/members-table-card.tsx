import { Badge, Button, Card, Table } from "@/components/ui";
import type { Member } from "@/services/member.service";

type MembersTableCardProps = {
  rows: Member[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
};

export function MembersTableCard({
  rows,
  isLoading,
  isDeleting,
  onEdit,
  onDelete
}: MembersTableCardProps) {
  return (
    <Card>
      <Card.Header
        title="Memberships"
        subtitle={`${rows.length} member${rows.length === 1 ? "" : "s"}`}
        iconName="user"
        iconClassName="bg-tertiary-soft text-tertiary"
      />
      <Card.Body className="p-0">
        <div className="-mt-px pb-6">
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
                  <Badge tone={row.status === "ACTIVE" ? "success" : "danger"}>{row.status}</Badge>
                )
              },
              {
                key: "actions",
                header: "Actions",
                render: (row) => (
                  <div className="flex gap-2">
                    <Button intent="ghost" size="sm" className="!px-2" onClick={() => onEdit(row)}>
                      Edit
                    </Button>
                    <Button
                      intent="ghost"
                      size="sm"
                      className="!px-2 text-danger hover:bg-danger-soft"
                      onClick={() => onDelete(row.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
            rows={rows}
            getRowId={(row) => row.id}
            emptyMessage={isLoading ? "Loading members..." : "No members found."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
