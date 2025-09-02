import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { FC } from "react";

export interface AppTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
}

export const AppTable: FC<AppTableProps<any>> = ({ columns, data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-primary-200 shadow-md rounded-lg">
        <thead className="bg-primary-50  rounded-t-lg">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={clsx(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    (header.column.columnDef as any).accessorKey === "_id" &&
                      "w-[100px]",
                    (header.column.columnDef as any).accessorKey === "action" &&
                      "text-right"
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="even:bg-primary-50 hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={clsx(
                    "px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900",
                    (cell.column.columnDef as any).accessorKey === "_id" &&
                      "w-[100px]",
                    (cell.column.columnDef as any).accessorKey === "action" &&
                      "flex justify-end"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
