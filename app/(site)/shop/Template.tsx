"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Header,
  Footer,
  ProductCard,
  BreadcrumbDemo,
  FilterSelect,
  ButtonDemo,
  ToggleGroupDemo,
  PaginationDemo,
} from "@/components/index.js";
import type { Product, ProductWithCart } from "@/modules/products/types";
import useProductsWithCart from "@/modules/products/hooks/useProductsWithCart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES, COLLECTIONS, BRANDS, PRICES } from "@/constants/index";
import { LOCAL_DATA } from "@/constants/index";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const { productImage } = LOCAL_DATA.images;

const DEFAULT_FILTERS = {
  category: "all-categories",
  brand: "all-brands",
  price: "all-prices",
  collections: ["all-collections"],
};

const Template = () => {
  const breadcrumbItems = [{ href: "/", label: "Home" }, { label: "Shop" }];

  return (
    <main className="shop-page pt-25  min-h-screen">
      <div className="container ">
        <BreadcrumbDemo items={breadcrumbItems} />
      </div>

      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);

  const [filters, setFilters] = useState(() => ({
    category: searchParams.get("category") || DEFAULT_FILTERS.category,
    brand: searchParams.get("brand") || DEFAULT_FILTERS.brand,
    price: searchParams.get("price") || DEFAULT_FILTERS.price,
    collections: searchParams.get("collections")?.split(",") || DEFAULT_FILTERS.collections,
  }));

  const query = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));
    params.set("limit", String(limit));

    if (filters.category !== "all-categories") {
      params.set("category", filters.category);
    } else {
      params.delete("category");
    }

    if (filters.brand !== "all-brands") {
      params.set("brand", filters.brand);
    } else {
      params.delete("brand");
    }

    if (filters.price !== "all-prices") {
      params.set("price", filters.price);
    } else {
      params.delete("price");
    }

    if (!filters.collections.includes("all-collections")) {
      params.set("collections", filters.collections.join(","));
    } else {
      params.delete("collections");
    }

    // if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });

    return params.toString() ? `?${params.toString()}` : "";
  }, [filters, page, limit]);

  useEffect(() => {
    router.push(query);

    if (typeof window !== "undefined")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }, [query]);

  const updateFilters = (updater = {}) => {
    setFilters((prev) => {
      return {
        ...prev,
        ...updater,
      };
    });
    setPage(1);
  };

  const { productsWithCart, pagination, isLoading } = useProductsWithCart({ query });

  const isDefaultFilters =
    filters.category === DEFAULT_FILTERS.category &&
    filters.brand === DEFAULT_FILTERS.brand &&
    filters.price === DEFAULT_FILTERS.price &&
    filters.collections[0] === DEFAULT_FILTERS.collections[0];

  return (
    <section className="pt-7!">
      <div className="container">
        <div className="flex gap-x-5 justify-between items-center flex-wrap min-h-8  mb-4">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl">Products </h2>
            <div className="h-1 w-1 bg-secondary-v2 rounded-full -mb-1"></div>
            <span className="text-xs font-semibold  text-secondary-v2 -mb-1">
              {isLoading ? "Loading..." : `${productsWithCart.length} of ${pagination.totalCount} displayed`}{" "}
            </span>
          </div>

          {!isDefaultFilters && (
            <ButtonDemo
              variant="ghostDanger"
              text="CLEAR ALL"
              startIcon={<X />}
              size="xs"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            />
          )}
        </div>

        <div className="flex gap-3 flex-col lg:items-start lg:flex-row">
          <Filters filters={filters} updateFilters={updateFilters} />
          <div className="flex-1">
            <ProductList
              filters={filters}
              updateFilters={updateFilters}
              productsWithCart={productsWithCart}
              isLoading={isLoading}
            />
            <PaginationDemo page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </section>
  );
};

type ProductsProps = {
  filters: any;
  updateFilters: (value: any) => void;
  productsWithCart?: ProductWithCart[];
  isLoading?: boolean;
};

const Filters = ({ filters, updateFilters }: ProductsProps) => {
  return (
    <Card className="flex-1 lg:max-w-[280px] shadow-sm ring-black/2 rounded-3xl">
      <CardContent className="border-none shadow-none pb-8">
        <div className=" flex flex-col sm:flex-row lg:flex-col items-start gap-3 mb-3 gap-y-6 pb-4 ">
          <FilterSelect
            className="flex-1 w-full"
            label="Category"
            items={CATEGORIES}
            value={filters.category}
            hasDefaultValue={filters.category === DEFAULT_FILTERS.category}
            onChange={(item) => {
              // setFilters((prev: any) => ({ ...prev, category: item.value }));
              updateFilters({ category: item.value });
            }}
            onClear={() => {
              // setFilters((prev: any) => ({ ...prev, category: DEFAULT_FILTERS.category }));
              updateFilters({ category: DEFAULT_FILTERS.category });
            }}
          />
          <FilterSelect
            className="flex-1 w-full"
            label="Brand"
            items={BRANDS}
            value={filters.brand}
            hasDefaultValue={filters.brand === DEFAULT_FILTERS.brand}
            onChange={(item) => {
              // setFilters((prev: any) => ({ ...prev, brand: item.value }));
              updateFilters({ brand: item.value });
            }}
            onClear={() => {
              // setFilters((prev: any) => ({ ...prev, brand: DEFAULT_FILTERS.brand }));
              updateFilters({ brand: DEFAULT_FILTERS.brand });
            }}
          />
          <FilterSelect
            className="flex-1 w-full"
            label="Price"
            items={PRICES}
            value={filters.price}
            hasDefaultValue={filters.price === DEFAULT_FILTERS.price}
            onChange={(item) => {
              // setFilters((prev: any) => ({ ...prev, price: item.value }));
              updateFilters({ price: item.value });
            }}
            onClear={() => {
              // setFilters((prev: any) => ({ ...prev, price: DEFAULT_FILTERS.price }));
              updateFilters({ price: DEFAULT_FILTERS.price });
            }}
          />
        </div>
        <ToggleGroupDemo
          type="multiple"
          value={filters.collections}
          items={COLLECTIONS}
          label="Product Type"
          onValueChange={(value: any) => {
            // if (!setFilters) return;
            // setFilters((prev: any) => {
            //   if (setPage) setPage(1);
            //   let next = [...value];

            //   const hasAll = next.includes("all-collections");
            //   const prevHasAll = prev.collections.includes("all-collections");

            //   // Case 1: user clicked "all"
            //   if (hasAll && !prevHasAll) {
            //     next = ["all-collections"];
            //   }
            //   // Case 2: user selected something else while "all" was active
            //   else {
            //     next = next.filter((v) => v !== "all-collections");
            //   }

            //   // Case 3: nothing selected → fallback to "all"
            //   if (next.length === 0) next = ["all-collections"];

            //   return {
            //     ...prev,
            //     collections: next,
            //   };
            // });

            let next = [...value];

            const hasAll = next.includes("all-collections");
            const prevHasAll = filters.collections.includes("all-collections");

            // Case 1: user clicked "all"
            if (hasAll && !prevHasAll) {
              next = ["all-collections"];
            }
            // Case 2: user selected something else while "all" was active
            else {
              next = next.filter((v) => v !== "all-collections");
            }

            // Case 3: nothing selected → fallback to "all"
            if (next.length === 0) next = ["all-collections"];

            updateFilters({ collections: next });
          }}
          hasDefaultValue={filters.collections[0] === DEFAULT_FILTERS.collections[0]}
          onClear={() => {
            // setFilters((prev: any) => ({ ...prev, collections: DEFAULT_FILTERS.collections }));
            updateFilters({ collections: DEFAULT_FILTERS.collections });
          }}
        />
      </CardContent>
    </Card>
  );
};

const ProductList = ({ updateFilters, productsWithCart = [], isLoading }: ProductsProps) => {
  return (
    <>
      {isLoading ? (
        <div className={` card-group products-card-group grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3`}>
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
          <Skeleton className="min-h-[360px] w-full rounded-xl" />
        </div>
      ) : !productsWithCart.length ? (
        <div className="bg-white border border-primary/10 rounded-xl p-10 flex flex-col justify-center  lg:max-w-[400px] min-h-[300px] text-center">
          <img src={productImage} alt="" className="max-w-30 mx-auto" />
          <h2 className="text-xl mb-5">No Products Found</h2>
          <p className="text-secondary-v3 mb-5">No products match your selected filters.</p>
          <ButtonDemo
            className="rounded-full w-full sm:w-auto"
            text={`Reset Filters`}
            onClick={() => {
              // setFilters(DEFAULT_FILTERS);
              updateFilters(DEFAULT_FILTERS);
            }}
          />
        </div>
      ) : (
        <div className={` card-group products-card-group grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3`}>
          {productsWithCart.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      )}
    </>
  );
};

export default Template;
