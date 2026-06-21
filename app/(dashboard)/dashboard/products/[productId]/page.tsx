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
import type { ProductApi } from "@/modules/products/types";
import { LOCAL_DATA } from "@/constants/index";
import ProductForm from "../components/product-form/ProductForm";
import { useParams } from "next/navigation";

const EditProduct = () => {
  const params = useParams();
  const productId = params.productId;


  const products = useProductStore((s) => s.products);
  const isProductsLoading = useProductStore((s) => s.isProductsLoading);
  const isProductsDeleting = useProductStore((s) => s.isProductsDeleting);
  const getProductAsync = useProductStore((s) => s.getProductAsync);

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
      label: `Edit Products`,
    },
  ];

  const [editingProduct, setEditingProduct] = useState<ProductApi | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsProductLoading(true);

      const data = await productsApi.getProduct({ productId });
      if (!data.success) return errorAlert(data.message || "Something went wrong.");

      setEditingProduct(data.data);
    } finally {
      setIsProductLoading(false);
    }
  };

  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    fetchData();
  }, [authUser]);

  return (
    <main className="edit-product-page p-5 pt-1">
      <h2 className="text-2xl mb-1 capitalize">Edit product</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />

      <ProductForm {...{ editingProduct,isProductLoading  }} />
    </main>
  );
};

export default EditProduct;
