import { format } from "date-fns";
import { Badge, Button, Card, Table } from "@/components/ui";
import type { Prescription } from "@/services/prescription.service";

type PrescriptionsTableCardProps = {
  rows: Prescription[];
  isLoading: boolean;
  isDispensing: boolean;
  onDispense: (prescriptionId: string) => void;
};

export function PrescriptionsTableCard({
  rows,
  isLoading,
  isDispensing,
  onDispense
}: PrescriptionsTableCardProps) {
  return (
    <Card>
      <Card.Header
        title="Pharmacy Queue"
        subtitle={`${rows.length} prescription${rows.length === 1 ? "" : "s"}`}
        iconName="clipboardList"
        iconClassName="bg-tertiary-soft text-tertiary"
      />
      <Card.Body className="p-0">
        <div className="-mt-px pb-6">
          <Table
            columns={[
              {
                key: "patient",
                header: "Patient",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-neutral-95">{row.patientName}</p>
                    <p className="text-xs text-neutral-80">{row.doctorName}</p>
                  </div>
                )
              },
              {
                key: "date",
                header: "Created",
                render: (row) => (
                  <span className="text-neutral-90">{format(new Date(row.createdAt), "MMM d, yyyy p")}</span>
                )
              },
              {
                key: "items",
                header: "Items",
                render: (row) => (
                  <span className="text-neutral-90">
                    {row.items.length} medicine{row.items.length === 1 ? "" : "s"}
                  </span>
                )
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <Badge tone={row.status === "DISPENSED" ? "success" : "warning"}>{row.status}</Badge>
                )
              },
              {
                key: "actions",
                header: "Actions",
                render: (row) => (
                  <Button
                    size="sm"
                    intent="secondary"
                    disabled={row.status === "DISPENSED" || isDispensing}
                    onClick={() => onDispense(row.id)}
                  >
                    {row.status === "DISPENSED" ? "Done" : "Dispense"}
                  </Button>
                )
              }
            ]}
            rows={rows}
            getRowId={(row) => row.id}
            emptyMessage={isLoading ? "Loading prescriptions..." : "No prescriptions found."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
