import { Badge, Button, Card, Table } from "@/components/ui";
import type { Doctor } from "@/services/doctor.service";

type DoctorsTableCardProps = {
  rows: Doctor[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctorId: string) => void;
};

export function DoctorsTableCard({
  rows,
  isLoading,
  isDeleting,
  onEdit,
  onDelete
}: DoctorsTableCardProps) {
  return (
    <Card>
      <Card.Header
        title="Doctors"
        subtitle={`${rows.length} doctor${rows.length === 1 ? "" : "s"}`}
        iconName="user"
        iconClassName="bg-tertiary-soft text-tertiary"
      />
      <Card.Body className="p-0">
        <div className="-mt-px pb-6">
          <Table
            columns={[
              {
                key: "name",
                header: "Name",
                render: (row) => <span className="font-semibold text-neutral-95">{row.name}</span>
              },
              {
                key: "specialization",
                header: "Specialization",
                render: (row) => <span className="text-neutral-90">{row.specialization}</span>
              },
              {
                key: "member",
                header: "Member",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-neutral-95">{row.memberName}</p>
                    <p className="text-xs text-neutral-80">{row.memberEmail}</p>
                  </div>
                )
              },
              {
                key: "license",
                header: "License",
                render: (row) => (
                  <span className="text-neutral-80">{row.licenseNumber || "Not provided"}</span>
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
            emptyMessage={isLoading ? "Loading doctors..." : "No doctors found."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

