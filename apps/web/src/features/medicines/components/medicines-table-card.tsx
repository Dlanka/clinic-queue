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
import type { Medicine } from "@/services/medicine.service";

type MedicinesTableCardProps = {
  allRows: Medicine[];
  rows: Medicine[];
  selectedFilter: "ALL" | "ACTIVE" | "LOW_STOCK" | "OUT_OF_STOCK";
  categoryFilter: string;
  searchTerm: string;
  isLoading: boolean;
  isDeleting: boolean;
  dataUpdatedAt: number;
  onFilterChange: (filter: "ALL" | "ACTIVE" | "LOW_STOCK" | "OUT_OF_STOCK") => void;
  onCategoryFilterChange: (value: string) => void;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicineId: string) => void;
};

const stockFilterOptions: Array<{
  value: "ALL" | "ACTIVE" | "LOW_STOCK" | "OUT_OF_STOCK";
  label: string;
  intent: "secondary" | "success" | "warning" | "danger";
}> = [
  { value: "ALL", label: "All", intent: "secondary" },
  { value: "ACTIVE", label: "Active", intent: "success" },
  { value: "LOW_STOCK", label: "Low Stock", intent: "warning" },
  { value: "OUT_OF_STOCK", label: "Out of Stock", intent: "danger" }
];

export function MedicinesTableCard({
  allRows,
  rows,
  selectedFilter,
  categoryFilter,
  searchTerm,
  isLoading,
  isDeleting,
  dataUpdatedAt,
  onFilterChange,
  onCategoryFilterChange,
  onSearch,
  onRefresh,
  onEdit,
  onDelete
}: MedicinesTableCardProps) {
  const counts = {
    ALL: allRows.length,
    ACTIVE: allRows.filter((row) => row.status === "ACTIVE" && !row.isLowStock && row.stockQty > 0)
      .length,
    LOW_STOCK: allRows.filter((row) => row.isLowStock && row.stockQty > 0).length,
    OUT_OF_STOCK: allRows.filter((row) => row.stockQty <= 0).length
  };

  const categoryOptions: SelectOption[] = [
    { value: "ALL", label: "All Categories" },
    ...Array.from(
      new Set(
        allRows
          .map((row) => row.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    )
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({ value: category, label: category }))
  ];

  return (
    <Card className="overflow-hidden">
      <Card.Header
        title="Medicine Catalog"
        subtitle="Tenant medicine stock and pricing"
        iconName="calendarDays"
        iconClassName="bg-tertiary-soft text-tertiary"
        className="border-b border-subtle"
        action={
          <div className="flex items-center gap-2">
            <Badge tone="warning" size="sm">
              {counts.LOW_STOCK} low stock
            </Badge>
            <Badge tone="danger" size="sm">
              {counts.OUT_OF_STOCK} out
            </Badge>
          </div>
        }
      />
      <Card.Body className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-subtle px-5 py-4">
          <FilterChipGroup
            className="flex flex-wrap items-center gap-2"
            selectedValue={selectedFilter}
            onChange={onFilterChange}
            items={stockFilterOptions.map((filter) => ({
              ...filter,
              count: counts[filter.value]
            }))}
          />

          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <div className="w-full md:w-44">
              <Select
                inputId="medicines-category-filter"
                options={categoryOptions}
                value={
                  categoryOptions.find((option) => option.value === categoryFilter) ??
                  categoryOptions[0]
                }
                onChange={(nextValue) => onCategoryFilterChange(nextValue?.value ?? "ALL")}
              />
            </div>
            <Input
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search medicines..."
              rounded="full"
              size="sm"
              startIconName="search"
              containerClassName="w-full md:w-52"
            />
          </div>
        </div>

        <div className="-mt-px">
          <Table
            columns={[
              {
                key: "name",
                header: "Name",
                render: (row) => (
                  <div>
                    <p className="text-sm font-semibold text-neutral-90">{row.name}</p>
                    <p className="text-xs text-neutral-70">{row.category || "Uncategorized"}</p>
                  </div>
                )
              },
              {
                key: "stock",
                header: "Stock",
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-90 font-semibold">
                      {row.stockQty} {row.unit || "units"}
                    </span>
                    {row.stockQty <= 0 ? (
                      <Badge tone="danger">OUT</Badge>
                    ) : (
                      <Badge tone={row.isLowStock ? "warning" : "success"}>
                        {row.isLowStock ? "LOW" : "OK"}
                      </Badge>
                    )}
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
                    {row.price !== undefined ? `LKR ${row.price.toFixed(2)}` : "N/A"}
                  </span>
                )
              },
              {
                key: "status",
                header: "Status",
                render: (row) => {
                  if (row.stockQty <= 0) {
                    return <Badge tone="danger">OUT OF STOCK</Badge>;
                  }
                  if (row.isLowStock) {
                    return <Badge tone="warning">LOW STOCK</Badge>;
                  }
                  return (
                    <Badge tone={row.status === "ACTIVE" ? "success" : "danger"}>
                      {row.status}
                    </Badge>
                  );
                }
              },
              {
                key: "actions",
                header: "Actions",
                headerClassName: "text-right",
                render: (row) => (
                  <div className="flex gap-2 justify-end">
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
            emptyMessage={isLoading ? "Loading medicines..." : "No medicines found."}
          />
        </div>


        <TableCardFooter
          shownCount={rows.length}
          totalCount={allRows.length}
          itemLabel="medicines"
          updatedAt={dataUpdatedAt}
          onRefresh={onRefresh}
        />
      </Card.Body>
    </Card>
  );
}







