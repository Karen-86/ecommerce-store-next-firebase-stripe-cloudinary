"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ChevronDown, EyeIcon } from "lucide-react";
import { CheckboxDemo } from "@/components/index";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  //   DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCAL_DATA } from "@/constants/index";
import { useAuthStore } from "@/modules/auth/store";
import type { Product } from "@/modules/products/types";
import { useProductStore } from "@/modules/products/store";
import { alert } from "@/lib/utils/alert";
import Link from "next/link";

const { productImage } = LOCAL_DATA.images;

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <CheckboxDemo
        variant="dark"
        className="px-3"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <CheckboxDemo
        variant="dark"
        checkboxClassName=" cursor-default!"
        checked={row.getIsSelected()}
        onClick={(e)=>e.stopPropagation()}
        onCheckedChange={(value) =>{ row.toggleSelected(!!value)}}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "index",
    header: () => <div className="px-3 text-center">#</div>,
    enableHiding: false,
    cell: ({ row, table }) => {
      const sortedRows = table.getSortedRowModel().rows;
      const sortedIndex = sortedRows.findIndex((r) => r.id === row.id);

      return <div>{sortedIndex + 1}</div>;
    },
  },
  {
    accessorKey: "image",
    header: () => <div className="px-3"> </div>,
    cell: ({ row }) => {
      const original = row.original;
      const variantPrimaryImage = original.media.find((image) => image.id === original.variants[0].primaryImage);
     
      return (
        <div className="relative rounded-sm overflow-hidden border w-12 h-12">
          <img src={variantPrimaryImage?.url || productImage} alt="product" className="block object-cover w-full h-full" />
        </div>
      );
    },
  },

  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button variant="ghostStrong" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize max-w-50 truncate" title={row.original.title}>
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "inventory",
    accessorFn: (row) => {
       return row.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    },
    header: ({ column }) => {
      return (
        <Button variant="ghostStrong" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Inventory
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = row.original.variants.reduce((total, variant) => total + (variant.stock || 0), 0);

      return (
        <div className="max-w-50 truncate">
          <span className="text-primary">{stock} in stock</span> for {row.original.variants.length} variant(s)
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghostStrong" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Category
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.original.category || 'Uncategorized'}</div>,
  },
  {
    id: "price",
    accessorFn: (row) => row.variants?.[0]?.price ?? 0,
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghostStrong" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">${row.original.variants[0].price}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

const Actions = ({ row = {} }: { row: any }) => {
  const payment = row.original;

  // const callback = (items: any) => {
  //   console.log(items);
  // };

  const user = useAuthStore((s) => s.user);
  const deleteProductAsync = useProductStore((s) => s.deleteProductAsync);

  const deleteProduct = async (productId: string = "") => {
    const data: any = await deleteProductAsync({ productId });
    if (!data.success) return alert(data.message || "Something went wrong");
    alert('Product deleted successfully.')
  };
  return (
    <div className="flex justify-end" onClick={(e)=>e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghostStrong" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.id)}>
            Copy payment ID
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/dashboard/products/${row.original.id}`}>Edit</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <div onClick={() => deleteProduct(row.original.id)}>Delete</div>
          </DropdownMenuItem>

          {/* <DropdownMenuItem>View payment data</DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
