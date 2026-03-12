import { Badge, Button, Card, Table } from "@/components/ui";
import type { Medicine } from "@/services/medicine.service";

type MedicinesTableCardProps = {
  rows: Medicine[];
  isLoading: boolean;
  isDeleting: boolean;
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicineId: string) => void;
};

export function MedicinesTableCard({
  rows,
  isLoading,
  isDeleting,
  onEdit,
  onDelete
}: MedicinesTableCardProps) {
  return (
    <Card>
      <Card.Header
        title="Medicines"
        subtitle={`${rows.length} medicine${rows.length === 1 ? "" : "s"}`}
        iconName="activity"
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
                    <p className="font-semibold text-neutral-95">{row.name}</p>
                    <p className="text-xs text-neutral-80">{row.category || "Uncategorized"}</p>
                  </div>
                )
              },
              {
                key: "stock",
                header: "Stock",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-95">
                      {row.stockQty} {row.unit || "units"}
                    </span>
                    <Badge tone={row.isLowStock ? "warning" : "success"}>
                      {row.isLowStock ? "LOW" : "OK"}
                    </Badge>
                  </div>
                )
              },
              {
                key: "reorder",
                header: "Reorder Level",
                render: (row) => <span className="text-neutral-90">{row.reorderLevel}</span>
              },
              {
                key: "price",
                header: "Price",
                render: (row) => (
                  <span className="text-neutral-90">
                    {row.price !== undefined ? `$${row.price.toFixed(2)}` : "N/A"}
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
            emptyMessage={isLoading ? "Loading medicines..." : "No medicines found."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}
