import type { ReactNode } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Cell,
  type Header
} from "@tanstack/react-table";
import { cn } from "../../../lib/cn";
import { tableStyles } from "./table.tv";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  emptyMessage?: ReactNode;
}

type TanstackColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

function getColumnStyleFromDef(columnDef: { size?: number; minSize?: number; maxSize?: number }) {
  if (typeof columnDef.size !== "number") {
    return undefined;
  }

  return {
    width: `${columnDef.size}px`,
    minWidth: typeof columnDef.minSize === "number" ? `${columnDef.minSize}px` : undefined,
    maxWidth: typeof columnDef.maxSize === "number" ? `${columnDef.maxSize}px` : undefined
  };
}

function getHeaderMeta<T>(header: Header<T, unknown>) {
  return (header.column.columnDef.meta ?? {}) as TanstackColumnMeta;
}

function getCellMeta<T>(cell: Cell<T, unknown>) {
  return (cell.column.columnDef.meta ?? {}) as TanstackColumnMeta;
}

export function Table<T>({ columns, rows, getRowId, emptyMessage = "No records found." }: TableProps<T>) {
  const styles = tableStyles();

  return (
    <div className={styles.wrapper()}>
      <table className={styles.table()}>
        <thead className={styles.head()}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={cn(styles.th(), column.headerClassName)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className={styles.row()}>
              <td className={styles.empty()} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={getRowId(row, index)} className={styles.row()}>
                {columns.map((column) => (
                  <td key={column.key} className={cn(styles.td(), column.cellClassName)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface TanstackTableProps<T> {
  columns: Array<ColumnDef<T>>;
  rows: T[];
  getRowId?: (row: T, index: number) => string;
  emptyMessage?: ReactNode;
}

export function TanstackTable<T>({
  columns,
  rows,
  getRowId,
  emptyMessage = "No records found."
}: TanstackTableProps<T>) {
  const styles = tableStyles();

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId ? { getRowId } : {})
  });

  return (
    <div className={styles.wrapper()}>
      <table className={styles.table()}>
        <thead className={styles.head()}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = getHeaderMeta(header);

                return (
                  <th
                    key={header.id}
                    className={cn(styles.th(), meta.headerClassName)}
                    style={getColumnStyleFromDef(header.column.columnDef)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr className={styles.row()}>
              <td className={styles.empty()} colSpan={table.getAllLeafColumns().length || 1}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.row()}>
                {row.getVisibleCells().map((cell) => {
                  const meta = getCellMeta(cell);

                  return (
                    <td
                      key={cell.id}
                      className={cn(styles.td(), meta.cellClassName)}
                      style={getColumnStyleFromDef(cell.column.columnDef)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
