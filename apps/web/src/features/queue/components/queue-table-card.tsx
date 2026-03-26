import { differenceInMinutes, format } from "date-fns";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTenantSettings } from "@/hooks/use-tenant-settings";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Badge,
  Button,
  Card,
  FilterChipGroup,
  Input,
  TableCardFooter,
  TanstackTable
} from "@/components/ui";
import type { QueueEntry } from "@/services/queue.service";
import { formatDoctorDisplayName } from "@/utils/doctor-name";
import { formatQueueTicket } from "@/utils/queue-ticket";
import { statusTone } from "../hooks";
import type { QueueStatusFilter } from "../store/queue.store";

const statusFilters: Array<{
  value: QueueStatusFilter;
  label: string;
  intent: "secondary" | "warning" | "info" | "success" | "error";
}> = [
  { value: "ALL", label: "All", intent: "secondary" },
  { value: "WAITING", label: "Waiting", intent: "warning" },
  { value: "IN_PROGRESS", label: "In Progress", intent: "info" },
  { value: "COMPLETED", label: "Completed", intent: "success" },
  { value: "CANCELLED", label: "Cancelled", intent: "error" }
];

interface QueueTableCardProps {
  rows: QueueEntry[];
  allRows: QueueEntry[];
  isLoading: boolean;
  dataUpdatedAt: number;
  statusFilter: QueueStatusFilter;
  searchTerm: string;
  canAddToQueue: boolean;
  canOperateQueue: boolean;
  actionBusy: boolean;
  showWaitTimeEstimates: boolean;
  onSearch: (value: string) => void;
  onStatusChange: (value: QueueStatusFilter) => void;
  onRefresh: () => void;
  onStart: (entry: QueueEntry) => void;
  onCancel: (id: string) => void;
  onOpenConsultation: (entry: QueueEntry) => void;
}

function formatWaitDuration(fromDate: string) {
  const totalMinutes = Math.max(0, differenceInMinutes(new Date(), new Date(fromDate)));

  if (totalMinutes < 1) {
    return "<1m";
  }

  const dayMinutes = 24 * 60;
  const hourMinutes = 60;

  const days = Math.floor(totalMinutes / dayMinutes);
  const minutesAfterDays = totalMinutes % dayMinutes;
  const hours = Math.floor(minutesAfterDays / hourMinutes);
  const minutes = minutesAfterDays % hourMinutes;

  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${totalMinutes}m`;
}

function rowWaitLabel(row: QueueEntry, showWaitTimeEstimates: boolean) {
  if (!showWaitTimeEstimates) {
    return "-";
  }

  if (row.status === "COMPLETED") {
    return "Done";
  }

  if (row.status === "CANCELLED") {
    return "-";
  }

  return formatWaitDuration(row.createdAt);
}

export function QueueTableCard({
  rows,
  allRows,
  isLoading,
  dataUpdatedAt,
  statusFilter,
  searchTerm,
  canAddToQueue,
  canOperateQueue,
  actionBusy,
  showWaitTimeEstimates,
  onSearch,
  onStatusChange,
  onRefresh,
  onStart,
  onCancel,
  onOpenConsultation
}: QueueTableCardProps) {
  const settingsQuery = useTenantSettings();
  const queueSettings = settingsQuery.data?.queue;

  const columns = useMemo<ColumnDef<QueueEntry>[]>(
    () => [
      {
        id: "number",
        header: "Queue #",
        size: 92,
        minSize: 92,
        maxSize: 92,
        cell: ({ row }) => (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-subtle bg-neutral-40 text-sm font-semibold">
            {formatQueueTicket(row.original.queueNumber, queueSettings)}
          </span>
        )
      },
      {
        id: "patient",
        header: "Patient",
        size: 280,
        minSize: 240,
        maxSize: 340,
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/queue/$queueId"
                params={{ queueId: row.original.id }}
                className="font-semibold text-neutral-95 transition-colors hover:text-primary"
              >
                {row.original.patientName}
              </Link>
              {row.original.isPriority ? (
                <Badge tone="warning" size="sm" iconName="zap">
                  PRIORITY
                </Badge>
              ) : null}
            </div>
            <p className="text-xs text-neutral-70">{formatDoctorDisplayName(row.original.doctorName)}</p>
          </div>
        )
      },
      {
        id: "added",
        header: "Added",
        size: 170,
        minSize: 150,
        maxSize: 210,
        cell: ({ row }) => (
          <span className="text-neutral-90">
            {format(new Date(row.original.createdAt), "MMM d, h:mm a")}
          </span>
        )
      },
      {
        id: "wait",
        header: "Wait",
        size: 120,
        minSize: 100,
        maxSize: 140,
        cell: ({ row }) => (
          <Badge tone="success" size="sm" variant="capitalize" iconName="clock3">
            {rowWaitLabel(row.original, showWaitTimeEstimates)}
          </Badge>
        )
      },
      {
        id: "status",
        header: "Status",
        size: 160,
        minSize: 140,
        maxSize: 190,
        cell: ({ row }) => (
          <Badge withDot tone={statusTone(row.original.status)}>
            {row.original.status.replace("-", " ").toLowerCase()}
          </Badge>
        )
      },
      {
        id: "actions",
        header: () => <span className="block text-right">Actions</span>,
        size: 290,
        minSize: 260,
        maxSize: 340,
        meta: {
          headerClassName: "text-right",
          cellClassName: "text-right"
        },
        cell: ({ row }) => (
          <div className="flex flex-wrap justify-end gap-2">
            {canOperateQueue && row.original.status === "WAITING" ? (
              <Button
                size="sm"
                variant="tonal"
                intent="warning"
                startIconName="play"
                disabled={actionBusy}
                onClick={() => onStart(row.original)}
              >
                Start
              </Button>
            ) : null}

            {row.original.status === "IN_PROGRESS" ? (
              <Button
                size="sm"
                variant="tonal"
                intent="info"
                startIconName="activity"
                onClick={() => onOpenConsultation(row.original)}
              >
                Continue
              </Button>
            ) : null}

            {(canAddToQueue || canOperateQueue) &&
            row.original.status !== "COMPLETED" &&
            row.original.status !== "CANCELLED" ? (
              <Button
                size="sm"
                variant="tonal"
                intent="error"
                startIconName="x"
                disabled={actionBusy}
                onClick={() => onCancel(row.original.id)}
              >
                Cancel
              </Button>
            ) : (
              <Button size="sm" intent="secondary" onClick={() => onOpenConsultation(row.original)}>
                View
              </Button>
            )}
          </div>
        )
      }
    ],
    [
      actionBusy,
      canAddToQueue,
      canOperateQueue,
      onCancel,
      onOpenConsultation,
      onStart,
      queueSettings,
      showWaitTimeEstimates
    ]
  );

  return (
    <Card className="overflow-hidden">
      <Card.Body className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle px-4 py-3 md:px-6 md:py-5">
          <FilterChipGroup
            className="flex flex-wrap gap-2"
            selectedValue={statusFilter}
            onChange={onStatusChange}
            items={statusFilters.map((filter) => ({
              ...filter,
              count:
                filter.value === "ALL"
                  ? allRows.length
                  : allRows.filter((row) => row.status === filter.value).length
            }))}
          />

          <Input
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Filter rows..."
            rounded="full"
            size="sm"
            startIconName="search"
            containerClassName="w-full md:w-60"
          />
        </div>

        <div className="w-full">
          <TanstackTable
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            emptyMessage={isLoading ? "Loading queue..." : "No queue entries for today."}
          />
        </div>

        <TableCardFooter
          shownCount={rows.length}
          totalCount={allRows.length}
          itemLabel="entries"
          updatedAt={dataUpdatedAt}
          onRefresh={onRefresh}
          showTopBorder
          className="px-4 md:px-6"
        />
      </Card.Body>
    </Card>
  );
}



