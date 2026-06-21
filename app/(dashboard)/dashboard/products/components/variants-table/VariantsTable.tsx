"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { VariantType } from "@/modules/products/types";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function VariantsTable<TData extends VariantType, TValue>({ data, columns }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,

    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20, // Set the default number of rows per page here
        // pageIndex: 1
      },
    },
    // manualPagination: true,
    // pageCount: calculateDynamicPageCount()
  });

  // const selectedRows = table.getSelectedRowModel().rows;

  // const [selectedValue, setSelectedValue] = useState(table.getState().pagination.pageSize.toString());

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 gap-5"></div>
      <div className=" overflow-x-auto">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} >
                {/* <TableHead className="">
                  <EyeIcon className="w-4 h-4 mx-3 text-gray-500" />
                </TableHead> */}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-black/3">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {}}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id} className={`px-5 ${index === 3 ? "w-full" : ""}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex px-2 bg-black/3 gap-[30px] items-center justify-center justify-md-end space-x-2 py-2 min-h-8 flex-wrap">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>

        <div className="space-x-2"></div> */}
      </div>
    </div>
  );
}
