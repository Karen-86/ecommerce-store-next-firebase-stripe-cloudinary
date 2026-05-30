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
import { ChevronDown, ChevronLeft, ChevronRight, EyeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ButtonDemo,
  // SelectScrollable,
  SelectDemo,
} from "@/components/index.js";
import { useAuthStore } from "@/modules/auth/store";
import type { Product } from "@/modules/products/types";
import { useProductStore } from "@/modules/products/store";
import { alert } from "@/lib/utils/alert";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ProductsTable<TData extends Product, TValue>({ data, columns }: DataTableProps<TData, TValue>) {
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

  const selectedRows = table.getSelectedRowModel().rows;

  const [selectedValue, setSelectedValue] = useState(table.getState().pagination.pageSize.toString());

  const deleteProductsAsync = useProductStore((s) => s.deleteProductsAsync);

    const deleteProducts = async (selectedProductIds: string[] = []) => {
      const data: any = await deleteProductsAsync({ query: `?productIds=${selectedProductIds.join(",")}` });
      if (!data.success) return alert(data.message || "Something went wrong");
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 gap-5">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm mr-auto"
        />
        {!!selectedRows.length && (
          <ButtonDemo
            className="hover:bg-black/80"
            variant="dark"
            // disabled={!table.getIsSomeRowsSelected()}
            onClick={() => {
              console.log(selectedRows.map((r) => r.original.id));
              deleteProducts(selectedRows.map((r) => r.original.id))
            }}
          >
            Delete selected
          </ButtonDemo>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* <TableHead className="">
                  <EyeIcon className="w-4 h-4 mx-3 text-gray-500" />
                </TableHead> */}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
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
                  <TableRow data-state={row.getIsSelected() && "selected"}>
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
      <div className="flex gap-[30px] items-center justify-center justify-md-end space-x-2 py-4 flex-wrap">
        {/* <SelectScrollable
          triggerClassName="w-[80px]"
          contentClassName="min-w-[0px]"
          defaultItems={[5, 10, 20, 50, 100].map((size) => {
            return {
              label: size,
              value: size,
              isSelected: table.getState().pagination.pageSize === size,
            };
          })}
          callback={(item: { value: string | number }) => table.setPageSize(Number(item.value))}
        /> */}
        <SelectDemo
          triggerClassName="w-[80px]"
          contentClassName="min-w-[0px]"
          value={selectedValue}
          items={[5, 10, 20, 50, 100].map((size) => {
            return {
              label: size,
              value: size,
            };
          })}
          onChange={(item: any) => {
            setSelectedValue(item.value.toString());
            table.setPageSize(Number(item.value));
          }}
        />
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>

        <div className="space-x-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button> */}
          <div className="flex items-center space-x-2">
            <ButtonDemo
              size="sm"
              text="First"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
            />
            <ButtonDemo
              icon={<ChevronLeft />}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              size="sm"
              variant="outline"
            />

            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>

            <ButtonDemo
              icon={<ChevronRight />}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              size="sm"
              variant="outline"
            />

            <ButtonDemo
              size="sm"
              text="Last"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
