"use client";

import React, { useEffect, useState } from "react";
import { Header, Footer, ProductCard, ButtonDemo } from "@/components/index.js";
import { useParams } from "next/navigation";
import { useProductStore } from "@/modules/products/store";

import Stripe from "stripe";
import { Product } from "@/modules/products/types";

const Template = () => {
  return (
    <main className="home-page pt-[150px]  min-h-[100vh]">
      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  return (
    <section className="">
      <div className="container">
        <h2 className="text-3xl mb-[1rem]">Product Details</h2>
        <ProductDetail />
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const products = useProductStore((s) => s.products);
  const getProductAsync = useProductStore((s) => s.getProductAsync);
  const isProductsLoading = useProductStore((s) => s.isProductsLoading);

  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);

  const fetchData = async () => {
    getProductAsync({
      productId: id,
      successCB: (data: Product) => data && setProduct(data),
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return !product ? (
    "Empty"
  ) : (
    <ProductCard
      product={product}
      setProduct={setProduct}
      className={`${isProductsLoading ? "pointer-events-none opacity-60" : ""} transition border-none shadow-none [&>.card-header]:max-w-[300px] [&_.card-link]:hidden`}
    />
  );
};

export default Template;
