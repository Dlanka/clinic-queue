import {
  Badge,
  Button,
  Card,
  FilterChipGroup,
  Input,
  Table,
  TableCardFooter
} from "@/components/ui";
import type { Member } from "@/services/member.service";

type MembersTableCardProps = {
  allRows: Member[];
  rows: Member[];
  selectedStatus: "ALL" | "ACTIVE" | "INVITED" | "DISABLED";
  searchTerm: string;
  isLoading: boolean;
  isDeleting: boolean;
  isResetting: boolean;
  dataUpdatedAt: number;
  onStatusChange: (status: "ALL" | "ACTIVE" | "INVITED" | "DISABLED") => void;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onResetPassword: (memberId: string) => void;
};

export function MembersTableCard({
  allRows,
  rows,
  selectedStatus,
  searchTerm,
  isLoading,
  isDeleting,
  isResetting,
  dataUpdatedAt,
  onStatusChange,
  onSearch,
  onRefresh,
  onEdit,
  onDelete,
  onResetPassword
}: MembersTableCardProps) {
  const counts = {
    ALL: allRows.length,
    ACTIVE: allRows.filter((row) => row.status === "ACTIVE").length,
    INVITED: allRows.filter((row) => row.status === "INVITED").length,
    DISABLED: allRows.filter((row) => row.status === "DISABLED").length
  };

  const statusFilters: Array<{
    value: "ALL" | "ACTIVE" | "INVITED" | "DISABLED";
    label: string;
    intent: "secondary" | "success" | "warning" | "danger";
  }> = [
    { value: "ALL", label: "All", intent: "secondary" },
    { value: "ACTIVE", label: "Active", intent: "success" },
    { value: "INVITED", label: "Invited", intent: "warning" },
    { value: "DISABLED", label: "Disabled", intent: "danger" }
  ];

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Tenant Members"
        subtitle="Manage access roles and account status"
        iconName="users"
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
            placeholder="Search members..."
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
                  <Badge
                    tone={
                      row.status === "ACTIVE"
                        ? "success"
                        : row.status === "INVITED"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {row.status}
                  </Badge>
                )
              },
              {
                key: "actions",
                headerClassName: "text-right",
                header: "Actions",
                render: (row) => (
                  <div className="flex flex-wrap justify-end gap-2">
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
                      intent="warning"
                      variant="tonal"
                      size="sm"
                      startIconName="lock"
                      onClick={() => onResetPassword(row.id)}
                      disabled={isResetting}
                    >
                      Reset Password
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
            emptyMessage={isLoading ? "Loading members..." : "No members found."}
          />
        </div>

        <TableCardFooter
          shownCount={rows.length}
          totalCount={allRows.length}
          itemLabel="members"
          updatedAt={dataUpdatedAt}
          onRefresh={onRefresh}
        />
      </Card.Body>
    </Card>
  );
}

