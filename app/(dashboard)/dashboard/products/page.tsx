"use client";

import React, { useState, useEffect, useRef } from "react";
import { BreadcrumbDemo, TableSkeleton } from "@/components/index";
import {
  InputDemo,
  ButtonDemo,
  AccordionDemo,
  UploadImageDemo,
  BlogFormSkeleton,
  DialogDemo,
} from "@/components/index";
import UploadProductsDialog from "./dialogs/upload-products-dialog/uploadProductsDialog";
import { PlusIcon, FileJson } from "lucide-react";
import { LOCAL_DATA } from "@/constants/index";
import { v4 as uuidv4 } from "uuid";
// import DeleteProductDialog from "./delete-product-dialog/DeleteProductDialog";
import { useProductStore } from "@/modules/products/store";
import { alert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useAuthStore } from "@/modules/auth/store";
import * as productsApi from "@/modules/products/api";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsTable } from "./products-table/ProductsTable";
import { columns } from "./products-table/columns";
import type { Product } from "@/modules/products/types";

const breadcrumbItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    label: `products`,
  },
];

const page = () => {
  const products = useProductStore((s) => s.products);
  const isProductsLoading = useProductStore((s) => s.isProductsLoading);
  const isProductsDeleting = useProductStore((s) => s.isProductsDeleting);
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);
  

  const authUser = useAuthStore((s) => s.authUser);

  const fetchData = async () => {
    const data: any = await getProductsAsync();
    if (!data.success) return alert(data.message || "Something went wrong");
  };



  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    fetchData();
  }, [authUser]);

  return (
    <main className="product-section-page p-5 pt-1">
      <h2 className="text-2xl mb-1 capitalize">Products</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />

      {isProductsLoading || isProductsDeleting ? (
        <Card className="mb-5 pt-5 pb-10">
          <CardContent>
            <TableSkeleton value="client loading (products)..." />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-5 pt-5 pb-10">
            <CardContent>
              <ProductsTable data={products} columns={columns}  />
            </CardContent>
          </Card>
          <Card className="mb-5 pt-5 pb-10">
            <CardContent>
              <UploadProducts />
            </CardContent>
          </Card>
        </>
      )}
    </main>
  );
};

export function UploadProducts() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);

  return (
    <div>
      <label className="text-xs mb-1 block">Upload a valid JSON file containing product data.</label>
      <div className="flex">
        <InputDemo
          ref={inputRef}
          className="mb-[1rem] w-fit "
          inputClassName="cursor-pointer rounded-r-none"
          name="picture"
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <UploadProductsDialog {...{ file, setFile, inputRef }} />
      </div>
    </div>
  );
}

export default page;
