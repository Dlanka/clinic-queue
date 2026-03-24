import { format } from "date-fns";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge, Button, Card, Input, TanstackTable } from "@/components/ui";
import type { IconName } from "@/config/icons";
import { cn } from "@/lib/cn";
import type { QueueEntry } from "@/services/queue.service";

interface WaitingPatientsListProps {
  rows: QueueEntry[];
  isLoading: boolean;
  actionBusy: boolean;
  onStart: (entry: QueueEntry) => void;
  onRefresh: () => void;
  updatedAt?: number;
  headerAction?: ReactNode;
}

type PriorityFilter = "ALL" | "NORMAL" | "PRIORITY";
const priorityFilterOptions: Array<{
  value: PriorityFilter;
  label: string;
  iconName?: IconName;
}> = [
  { value: "ALL", label: "All" },
  { value: "NORMAL", label: "Normal" },
  { value: "PRIORITY", label: "Priority", iconName: "zap" }
];

function waitLabel(createdAt: string) {
  const diffMinutes = Math.max(
    1,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000)
  );

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function WaitingPatientsList({
  rows,
  isLoading,
  actionBusy,
  onStart,
  onRefresh,
  updatedAt,
  headerAction
}: WaitingPatientsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");

  const columns = useMemo<ColumnDef<QueueEntry>[]>(
    () => [
      {
        id: "no",
        header: "NO",
        size: 72,
        minSize: 64,
        maxSize: 80,
        cell: ({ row }) => (
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md border border-subtle bg-neutral-40 text-sm font-semibold",
              row.original.isPriority ? "text-warning" : "text-neutral-95"
            )}
          >
            {row.original.queueNumber}
          </span>
        )
      },
      {
        id: "patient",
        header: "PATIENT",
        size: 320,
        minSize: 250,
        maxSize: 380,
        cell: ({ row }) => (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-neutral-95">{row.original.patientName}</p>
              {row.original.isPriority ? (
                <Badge tone="warning" size="sm" iconName="zap">
                  PRIORITY
                </Badge>
              ) : null}
            </div>
            <p className="text-xs text-neutral-70">
              {format(new Date(row.original.createdAt), "h:mm a")}
            </p>
          </div>
        )
      },
      {
        id: "visitType",
        header: "VISIT TYPE",
        size: 160,
        minSize: 140,
        maxSize: 190,
        cell: () => <span className="text-sm text-neutral-90">Consultation</span>
      },
      {
        id: "waiting",
        header: "WAITING",
        size: 130,
        minSize: 120,
        maxSize: 150,
        cell: ({ row }) => (
          <Badge tone={row.original.isPriority ? "warning" : "success"} size="sm">
            {waitLabel(row.original.createdAt)}
          </Badge>
        )
      },
      {
        id: "status",
        header: "STATUS",
        size: 130,
        minSize: 120,
        maxSize: 150,
        cell: () => <Badge tone="warning">WAITING</Badge>
      },
      {
        id: "actions",
        header: "ACTIONS",
        size: 180,
        minSize: 150,
        maxSize: 210,
        meta: {
          headerClassName: "text-right",
          cellClassName: "text-right"
        },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="fill"
              intent="primary"
              startIconName="play"
              disabled={actionBusy}
              onClick={() => onStart(row.original)}
            >
              Start
            </Button>
          </div>
        )
      }
    ],
    [actionBusy, onStart]
  );

  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      if (priorityFilter === "PRIORITY" && !row.isPriority) {
        return false;
      }

      if (priorityFilter === "NORMAL" && row.isPriority) {
        return false;
      }

      if (!term) {
        return true;
      }

      return (
        row.patientName.toLowerCase().includes(term) ||
        "consultation".includes(term) ||
        (row.isPriority ? "priority" : "normal").includes(term)
      );
    });
  }, [priorityFilter, rows, searchTerm]);

  const averageWait = filteredRows.length
    ? Math.round(
        filteredRows.reduce(
          (sum, row) =>
            sum +
            Math.max(1, Math.floor((Date.now() - new Date(row.createdAt).getTime()) / 60_000)),
          0
        ) / filteredRows.length
      )
    : 0;

  return (
    <Card>
      <Card.Header
        title="Waiting Patients"
        subtitle="Today's queue for your consultation"
        iconName="users"
        iconClassName="bg-warning-soft text-warning"
        action={headerAction}
      />
      <Card.Body className="p-0">
        <div className="scrollbar-thin-minimal flex flex-nowrap justify-between items-center gap-6 overflow-x-auto px-4 py-3 bg-neutral-20">
          <div className="w-full max-w-96">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, visit type..."
              startIconName="search"
              rounded="full"
              size="sm"
            />
          </div>

          <div className="flex flex-nowrap items-center gap-4">
            <div className="flex flex-nowrap items-center gap-2">
              {priorityFilterOptions.map((filter) => {
                const selected = priorityFilter === filter.value;
                return (
                  <Button
                    key={filter.value}
                    type="button"
                    size="sm"
                    variant={selected ? "tonal" : "text"}
                    intent={
                      selected ? (filter.value === "PRIORITY" ? "warning" : "info") : "neutral"
                    }
                    iconSize={12}
                    startIconName={filter.iconName}
                    preventAnimation
                    onClick={() => setPriorityFilter(filter.value)}
                    className="px-4 h-7"
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>

            <p className="shrink-0 whitespace-nowrap text-2xs text-neutral-70">
              Showing <span className="font-semibold text-primary">{filteredRows.length}</span> of{" "}
              <span className="font-semibold">{rows.length}</span>
            </p>
          </div>
        </div>

        <TanstackTable
          columns={columns}
          rows={filteredRows}
          getRowId={(row) => row.id}
          emptyMessage={isLoading ? "Loading waiting patients..." : "No patients waiting."}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-subtle px-4 py-3 text-xs text-neutral-70">
          <p>
            {filteredRows.length} waiting - Avg wait {averageWait} min - Updated{" "}
            {updatedAt ? format(updatedAt, "h:mm a") : "-"}
          </p>
          <Button
            size="sm"
            variant="text"
            intent="ghost"
            startIconName="refreshCcw"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
