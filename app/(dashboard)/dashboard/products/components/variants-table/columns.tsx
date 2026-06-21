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
import { VariantType } from "@/modules/products/types";
import { InputDemo } from "@/components/index";
import VariantImagesDialog from "../dialogs/variant-images-dialog/VariantImagesDialog";
import type { MediaItemType } from "@/modules/products/types";

const { productImage } = LOCAL_DATA.images;

export const getColumns = ({
  variants,
  setVariants = () => {},
  media,
  onBlur,
}: {
  variants: VariantType[];
  setVariants: React.Dispatch<React.SetStateAction<VariantType[]>>;
  media: MediaItemType[];
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): ColumnDef<VariantType>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <CheckboxDemo
  //       className="px-3"
  //       checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <CheckboxDemo
  //       checkboxClassName=" cursor-default!"
  //       checked={row.getIsSelected()}
  //       onClick={(e) => e.stopPropagation()}
  //       onCheckedChange={(value) => {
  //         row.toggleSelected(!!value);
  //       }}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: () => <div className="px-3 text-xs">Variant</div>,
    cell: ({ row }) => {
      const original = row.original;
      // const variantPrimaryImage = original.images.find((image) => image.id === original.variants[0].primaryImage);
      const primaryImage = media.find((mediaItem) => mediaItem.id === original.primaryImage)?.url;
      const value = Object.values(row.original.attributes).join("/");
      return (
        <div className="flex items-center gap-2">
          <VariantImagesDialog
            {...{ media, variant: row.original, setVariants }}
            trigger={
              <div className="relative rounded-sm overflow-hidden border w-12 h-12 hover:border-black/30">
                <img src={primaryImage || productImage} alt="product" className="block object-cover h-full w-full" />
              </div>
            }
          />

          <div className="capitalize max-w-50 truncate text-xs" title={value}>
            {value || 'Default'}
          </div>
        </div>
      );
    },
  },

  // {
  //   accessorKey: "name",
  //   header: () => <div className="px-3 text-xs">Variant </div>,
  //   cell: ({ row }) => {
  //     const value = Object.values(row.original.attributes).join(" / ");

  //     return (
  //       <div className="capitalize max-w-50 truncate text-xs" title={value}>
  //         {value}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "price",
    sortingFn: (rowA, rowB) => {
      const a = Number(String(rowA.original.price ?? "").replace(/,/g, ""));

      const b = Number(String(rowB.original.price ?? "").replace(/,/g, ""));

      return a - b;
    },
    header: ({ column }) => {
      return (
        <Button
          className=""
          size="xs"
          variant="ghostStrong"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="w-3! h-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [value, setValue] = React.useState(row.original.price || "");

      return (
        <div className="w-30">
          <InputDemo
            id={row.original.id}
            name="price"
            placeholder="0.00"
            type="text"
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            labelClassName="text-xs text-black/70"
            value={value}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "compareAtPrice",
    sortingFn: (rowA, rowB) => {
      const a = Number(String(rowA.original.compareAtPrice ?? "").replace(/,/g, ""));

      const b = Number(String(rowB.original.compareAtPrice ?? "").replace(/,/g, ""));

      return a - b;
    },
    header: ({ column }) => {
      return (
        <Button
          className=""
          size="xs"
          variant="ghostStrong"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Compare-at price
          <ArrowUpDown className="w-3! h-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [value, setValue] = React.useState(row.original.compareAtPrice || "");

      return (
        <div className="w-30">
          <InputDemo
            id={row.original.id}
            name="compareAtPrice"
            placeholder="0.00"
            type="text"
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            labelClassName="text-xs text-black/70"
            value={value}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "stock",

    header: ({ column }) => {
      return (
        <Button
          className=""
          size="xs"
          variant="ghostStrong"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Available
          <ArrowUpDown className="w-3! h-3!" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [value, setValue] = React.useState<string | number | null>(row.original.stock);

      return (
        <div className="w-30">
          <InputDemo
            id={row.original.id}
            name="stock"
            // placeholder="0.00"
            type="number"
            onChange={(e) => setValue(String(Math.floor(Number(e.target.value))))}
            onBlur={onBlur}
            labelClassName="text-xs text-black/70"
            value={value ?? 0}
          />
        </div>
      );
    },
  },
];
