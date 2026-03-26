import {
  Badge,
  Button,
  Card,
  FilterChipGroup,
  Input,
  Table,
  TableCardFooter
} from "@/components/ui";
import type { Doctor } from "@/services/doctor.service";

type DoctorsTableCardProps = {
  allRows: Doctor[];
  rows: Doctor[];
  selectedStatus: "ALL" | "ACTIVE" | "DISABLED";
  searchTerm: string;
  isLoading: boolean;
  isDeleting: boolean;
  dataUpdatedAt: number;
  onStatusChange: (status: "ALL" | "ACTIVE" | "DISABLED") => void;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctorId: string) => void;
};

export function DoctorsTableCard({
  allRows,
  rows,
  selectedStatus,
  searchTerm,
  isLoading,
  isDeleting,
  dataUpdatedAt,
  onStatusChange,
  onSearch,
  onRefresh,
  onEdit,
  onDelete
}: DoctorsTableCardProps) {
  const counts = {
    ALL: allRows.length,
    ACTIVE: allRows.filter((row) => row.status === "ACTIVE").length,
    DISABLED: allRows.filter((row) => row.status === "DISABLED").length
  };

  const statusFilters: Array<{
    value: "ALL" | "ACTIVE" | "DISABLED";
    label: string;
    intent: "secondary" | "success" | "danger";
  }> = [
    { value: "ALL", label: "All", intent: "secondary" },
    { value: "ACTIVE", label: "Active", intent: "success" },
    { value: "DISABLED", label: "Disabled", intent: "danger" }
  ];

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Doctor Directory"
        subtitle="Clinical profiles and member assignments"
        iconName="user"
        iconClassName="bg-tertiary-soft text-tertiary"
        className="border-b border-subtle"
        action={
          <div className="flex items-center gap-2">
            <Badge tone="success" size="sm">
              {counts.ACTIVE} active
            </Badge>
            <Badge tone="danger" size="sm">
              {counts.DISABLED} disabled
            </Badge>
          </div>
        }
      />
      <Card.Body className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle px-5 py-4">
          <FilterChipGroup
            className="flex flex-wrap items-center gap-2"
            selectedValue={selectedStatus}
            onChange={onStatusChange}
            items={statusFilters.map((filter) => ({
              ...filter,
              count: counts[filter.value]
            }))}
          />

          <Input
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search doctors..."
            rounded="full"
            size="sm"
            startIconName="search"
            containerClassName="w-full md:w-56"
          />
        </div>

        <div className="-mt-px">
          <Table
            columns={[
              {
                key: "name",
                header: "Name",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-neutral-95">{row.name}</p>
                    <p className="text-xs text-neutral-70">{row.specialization}</p>
                  </div>
                )
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
                headerClassName: "text-right",
                header: "Actions",
                render: (row) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      intent="info"
                      variant="tonal"
                      size="sm"
                      startIconName="squarePen"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      intent="danger"
                      variant="tonal"
                      size="sm"
                      startIconName="trash2"
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

        <TableCardFooter
          shownCount={rows.length}
          totalCount={allRows.length}
          itemLabel="doctors"
          updatedAt={dataUpdatedAt}
          onRefresh={onRefresh}
        />
      </Card.Body>
    </Card>
  );
}

