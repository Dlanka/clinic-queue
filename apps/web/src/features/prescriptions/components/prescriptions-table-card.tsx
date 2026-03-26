import { format } from "date-fns";
import {
  Badge,
  Button,
  Card,
  FilterChipGroup,
  Input,
  Select,
  Table,
  TableCardFooter,
  type SelectOption
} from "@/components/ui";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import type { Prescription } from "@/services/prescription.service";

type PrescriptionsTableCardProps = {
  rows: Prescription[];
  allRows: Prescription[];
  selectedStatus: "ALL" | "PRESCRIBED" | "DISPENSED";
  selectedDateFilter: "TODAY" | "ALL" | string;
  dateFilterOptions: SelectOption[];
  searchTerm: string;
  isLoading: boolean;
  canEditConsultation: boolean;
  canEditPrescribed: boolean;
  canEditDispensed: boolean;
  onStatusChange: (status: "ALL" | "PRESCRIBED" | "DISPENSED") => void;
  onDateFilterChange: (value: "TODAY" | "ALL" | string) => void;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onViewDetails: (prescription: Prescription) => void;
  onEditConsultation: (queueEntryId: string) => void;
  dataUpdatedAt: number;
};

const statusFilters: Array<{
  value: "ALL" | "PRESCRIBED" | "DISPENSED";
  label: string;
  intent: "secondary" | "warning" | "success";
}> = [
  { value: "ALL", label: "All", intent: "secondary" },
  { value: "PRESCRIBED", label: "Prescribed", intent: "warning" },
  { value: "DISPENSED", label: "Dispensed", intent: "success" }
];

export function PrescriptionsTableCard({
  rows,
  allRows,
  selectedStatus,
  selectedDateFilter,
  dateFilterOptions,
  searchTerm,
  isLoading,
  canEditConsultation,
  canEditPrescribed,
  canEditDispensed,
  onStatusChange,
  onDateFilterChange,
  onSearch,
  onRefresh,
  onViewDetails,
  onEditConsultation,
  dataUpdatedAt
}: PrescriptionsTableCardProps) {
  const counts = {
    ALL: allRows.length,
    PRESCRIBED: allRows.filter((row) => row.status === "PRESCRIBED").length,
    DISPENSED: allRows.filter((row) => row.status === "DISPENSED").length
  };

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Pharmacy Queue"
        subtitle="Prescriptions pending dispense and completed today"
        iconName="clipboardList"
        iconClassName="bg-tertiary-soft text-tertiary"
        className="border-b border-subtle"
        action={
          <Badge tone="warning" size="sm">
            {counts.PRESCRIBED} pending
          </Badge>
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

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <div className="w-full md:w-52">
              <Select
                inputId="prescriptions-date-filter"
                options={dateFilterOptions}
                value={
                  dateFilterOptions.find((option) => option.value === selectedDateFilter) ??
                  dateFilterOptions[0]
                }
                onChange={(nextValue) => onDateFilterChange(nextValue?.value ?? "TODAY")}
              />
            </div>
            <Input
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search patient..."
              rounded="full"
              size="sm"
              startIconName="search"
              containerClassName="w-full md:w-56"
            />
          </div>
        </div>

        <div className="-mt-px">
          <Table
            columns={[
              {
                key: "id",
                header: "RX ID",
                render: (row) => (
                  <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
                    RX-{row.id.slice(-4).toUpperCase()}
                  </span>
                )
              },
              {
                key: "patient",
                header: "Patient",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-neutral-95">{row.patientName}</p>
                    <p className="text-xs text-neutral-70">
                      {formatDoctorDisplayName(row.doctorName)}
                    </p>
                  </div>
                )
              },
              {
                key: "date",
                header: "Created",
                render: (row) => (
                  <div>
                    <p className="text-neutral-90">
                      {format(new Date(row.createdAt), "MMM d, h:mm a")}
                    </p>
                    <p className="text-xs text-neutral-70">
                      {format(new Date(row.createdAt), "eeee")}
                    </p>
                  </div>
                )
              },
              {
                key: "items",
                header: "Items",
                render: (row) => (
                  <span className="text-neutral-90 inline-flex items-center gap-1">
                    {row.items.length} medicine{row.items.length === 1 ? "" : "s"}
                  </span>
                )
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <Badge tone={row.status === "DISPENSED" ? "success" : "warning"}>
                    {row.status}
                  </Badge>
                )
              },
              {
                key: "actions",
                headerClassName: "text-right",
                header: "Actions",
                render: (row) => {
                  const canEditRow =
                    canEditConsultation &&
                    row.queueEntryId &&
                    ((row.status === "PRESCRIBED" && canEditPrescribed) ||
                      (row.status === "DISPENSED" && canEditDispensed));

                  return (
                    <div className="flex flex-wrap justify-end gap-2">
                      {canEditRow ? (
                        <Button
                          size="sm"
                          variant="tonal"
                          intent="info"
                          startIconName="squarePen"
                          onClick={() => onEditConsultation(row.queueEntryId!)}
                        >
                          Edit
                        </Button>
                      ) : null}

                      <Button
                        size="sm"
                        variant="outlined"
                        intent="neutral"
                        startIconName="list"
                        onClick={() => onViewDetails(row)}
                      >
                        View
                      </Button>
                    </div>
                  );
                }
              }
            ]}
            rows={rows}
            getRowId={(row) => row.id}
            emptyMessage={isLoading ? "Loading prescriptions..." : "No prescriptions found."}
          />
        </div>

        <TableCardFooter
          shownCount={rows.length}
          totalCount={allRows.length}
          itemLabel="entries"
          updatedAt={dataUpdatedAt}
          onRefresh={onRefresh}
        />
      </Card.Body>
    </Card>
  );
}
