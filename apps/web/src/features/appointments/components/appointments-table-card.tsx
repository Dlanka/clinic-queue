import { format } from "date-fns";
import { Badge, Button, Card, Table } from "@/components/ui";
import type { Appointment, AppointmentStatus } from "@/services/appointment.service";

const statusFilters: Array<{ value: "ALL" | AppointmentStatus; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" }
];

function statusTone(status: AppointmentStatus): "neutral" | "success" | "danger" {
  if (status === "COMPLETED") {
    return "success";
  }
  if (status === "CANCELLED") {
    return "danger";
  }
  return "neutral";
}

interface AppointmentsTableCardProps {
  rows: Appointment[];
  isLoading: boolean;
  statusFilter: "ALL" | AppointmentStatus;
  isDeleting: boolean;
  onStatusChange: (nextValue: "ALL" | AppointmentStatus) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

export function AppointmentsTableCard({
  rows,
  isLoading,
  statusFilter,
  isDeleting,
  onStatusChange,
  onEdit,
  onDelete
}: AppointmentsTableCardProps) {
  return (
    <Card>
      <Card.Body className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              intent={statusFilter === filter.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onStatusChange(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

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
              key: "time",
              header: "Date & Time",
              render: (row) => (
                <span className="text-neutral-90">
                  {format(new Date(row.scheduledAt), "MMM d, yyyy h:mm a")}
                </span>
              )
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge>
            },
            {
              key: "actions",
              header: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <Button size="sm" intent="ghost" className="!px-2" onClick={() => onEdit(row)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    intent="ghost"
                    className="!px-2 text-danger hover:bg-danger-soft"
                    disabled={isDeleting}
                    onClick={() => onDelete(row.id)}
                  >
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
          rows={rows}
          getRowId={(row) => row.id}
          emptyMessage={isLoading ? "Loading appointments..." : "No appointments found."}
        />
      </Card.Body>
    </Card>
  );
}
