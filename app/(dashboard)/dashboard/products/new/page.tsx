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
import { PlusIcon, FileJson } from "lucide-react";
import { useProductStore } from "@/modules/products/store";
import { alert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useAuthStore } from "@/modules/auth/store";
import { Card, CardContent } from "@/components/ui/card";
import * as productsApi from "@/modules/products/api";
import type { Product } from "@/modules/products/types";
import { LOCAL_DATA } from "@/constants/index";
import { v4 as uuidv4 } from "uuid";
import ProductForm from "../components/product-form/ProductForm";

const AddProduct = () => {
  const products = useProductStore((s) => s.products);
  const isProductsLoading = useProductStore((s) => s.isProductsLoading);
  const isProductsDeleting = useProductStore((s) => s.isProductsDeleting);
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);

  const authUser = useAuthStore((s) => s.authUser);

  const breadcrumbItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/dashboard/products",
      label: `Products`,
    },
    {
      label: `Add Products`,
    },
  ];

  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    // fetchData();
  }, [authUser]);

  return (
    <main className="add-product-page p-5 pt-1">
      <h2 className="text-2xl mb-1 capitalize">Add product</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />

      <ProductForm/>
    </main>
  );
};

export default AddProduct;
