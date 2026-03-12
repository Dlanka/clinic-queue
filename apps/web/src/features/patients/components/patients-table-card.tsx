import { format } from "date-fns";
import { Badge, Button, Card, Table } from "@/components/ui";
import type { Patient } from "@/services/patient.service";

type PatientsTableCardProps = {
  rows: Patient[];
  isLoading: boolean;
  isDeleting: boolean;
  selectedPatientId: string | null;
  onSelect: (patientId: string) => void;
  onEdit: (patient: Patient) => void;
  onDeactivate: (patientId: string) => void;
};

export function PatientsTableCard({
  rows,
  isLoading,
  isDeleting,
  selectedPatientId,
  onSelect,
  onEdit,
  onDeactivate
}: PatientsTableCardProps) {
  return (
    <Card>
      <Card.Header
        title="Patients"
        subtitle={`${rows.length} patient${rows.length === 1 ? "" : "s"}`}
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
                render: (row) => (
                  <div>
                    <p className="font-semibold text-neutral-95">{row.fullName}</p>
                    <p className="text-xs text-neutral-80">{row.phone || "No phone"}</p>
                  </div>
                )
              },
              {
                key: "gender",
                header: "Gender",
                render: (row) => <span className="text-neutral-90">{row.gender ?? "N/A"}</span>
              },
              {
                key: "dob",
                header: "DOB",
                render: (row) => (
                  <span className="text-neutral-90">
                    {row.dateOfBirth ? format(new Date(row.dateOfBirth), "MMM d, yyyy") : "N/A"}
                  </span>
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
                    <Button
                      intent={selectedPatientId === row.id ? "secondary" : "ghost"}
                      size="sm"
                      className="!px-2"
                      onClick={() => onSelect(row.id)}
                    >
                      View
                    </Button>
                    <Button intent="ghost" size="sm" className="!px-2" onClick={() => onEdit(row)}>
                      Edit
                    </Button>
                    <Button
                      intent="ghost"
                      size="sm"
                      className="!px-2 text-danger hover:bg-danger-soft"
                      onClick={() => onDeactivate(row.id)}
                      disabled={isDeleting}
                    >
                      Deactivate
                    </Button>
                  </div>
                )
              }
            ]}
            rows={rows}
            getRowId={(row) => row.id}
            emptyMessage={isLoading ? "Loading patients..." : "No patients found."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
