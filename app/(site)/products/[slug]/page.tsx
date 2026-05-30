import React from "react";
import Template from "./Template";
import * as productFetchers from "@/modules/products/fetchers"
import type { Product } from "@/modules/products/types";
import { notFound } from "next/navigation";

export const revalidate = 60; // 1min
// export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const { data } = await productFetchers.fetchProductBySlug({ productSlug: slug });

  if (!data) return null
  
  return {
    title: data.name,
    description: data.description,
    openGraph: {
      title: data.name,
      description: data.description,
      type: "article",
      images: data.media?.map((img) => `${siteUrl}/${img.url}`) || [], // Open Graph doesn’t support base64 data URIs.
    },
  };
}

export async function generateStaticParams() {
  const { data } = await productFetchers.fetchProducts();
  const products = data ?? [];
  
  return products?.map((product) => product);
}

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const { data, message } = await productFetchers.fetchProductBySlug({ productSlug: slug });

  if (message === "Document not found") notFound();
  if(!data) return 'No Data'
  return <Template product={data} />;
}
