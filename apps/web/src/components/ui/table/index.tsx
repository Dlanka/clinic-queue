import type { ReactNode } from "react";
import { tableStyles } from "./table.tv";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  emptyMessage?: string;
}

export function Table<T>({ columns, rows, getRowId, emptyMessage = "No records found." }: TableProps<T>) {
  const styles = tableStyles();

  return (
    <div className={styles.wrapper()}>
      <table className={styles.table()}>
        <thead className={styles.head()}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={styles.th()}>
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
                  <td key={column.key} className={styles.td()}>
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
