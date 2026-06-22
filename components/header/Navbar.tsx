"use client";

import React, { useState, useEffect } from "react";
import LOCAL_DATA from "@/constants/localData";
import { ButtonDemo, NavUserDemo, CommandDialogDemo } from "@/components/index.js";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { SidebarNavigationMenuDemo } from "./SidebarNavigationMenuDemo";
import { useProductStore } from "@/modules/products/store";
import { useCartStore } from "@/modules/carts/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchProduct } from "@/modules/products/types";
import { ShoppingBag, Search } from "lucide-react";
import { useAuthStore } from "@/modules/auth/store";
import type { Product, ProductWithCart } from "@/modules/products/types";

const { logo, productImage } = LOCAL_DATA.images;
const { cartIcon, accountIcon } = LOCAL_DATA.svgs;

export const navLinks = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "/shop" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [searchProducts, setSearchProducts] = useState<SearchProduct[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const cart = useCartStore((s) => s.cart);
  const setIsCartSheetOpen = useCartStore((s) => s.setIsCartSheetOpen);
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);

  
  const fetchProducts = async ({ query = "" }: { query: string }) => {
    try {
      setIsLoading(true);
      
      const data: any = await getProductsAsync({ query });
      
      // if (!data.success) return alert(data.message || "Something went wrong");
      if (!data.success) return setSearchProducts([]);
      
      const products: SearchProduct[] = data.data.products.map((product: any) => {
        const variantPrimaryImage = product.media.find((image:any) => image.id === product.variants[0].primaryImage);

        return {
          id: product.id,
          label: product.name,
          value: product.name,
          price: "$" + product.variants[0].price,
          description: product.description,
          startIcon: (
            <img
              className="w-full h-full object-contain"
              src={variantPrimaryImage?.url || productImage}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = productImage;
              }}
              alt=""
            />
          ),
        };
      });

      setSearchProducts(products);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  const authUser = useAuthStore((s) => s.authUser);

  const handleSelectChange = (item: { id: string }) => {
    router.push(`/products/${item.id}`);
    console.log(item);
  };

  useEffect(() => {
    let query = searchQuery;
    if (query === "") {
      query = "?collections=featured&limit=5";
    } else {
      query = `?search=${query}`;
    }

    // setIsLoading(true)
    const timeout = setTimeout(() => {
      fetchProducts({ query: query });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <nav className="navbar absolute top-0 w-full z-3 border-b border-primary/10 pr-[10px]">
      <div className="container  py-3 flex items-center justify-between ">
        <a href="/">
          <img src={logo} alt="" className="max-w-[90px] h-auto " />
        </a>

        <div className="flex items-center gap-2">
          <NavigationMenuDemo />{" "}
          <Link href="/dashboard" target="_blank" className="text-xs px-3 py-1 rounded-full border cursor-pointer">
            Seller Dashboard
          </Link>
        </div>

        <SidebarNavigationMenuDemo />

        <div className="btn-group hidden lg:flex items-center">
          <CommandDialogDemo
            items={searchProducts}
            onSelect={handleSelectChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoading}
          />
          <ButtonDemo
            onClick={() => {
              setIsCartSheetOpen(true);
            }}
            className="rounded-full bg-transparent! shadow-none text-gray-600 hover:text-gray-800 relative [&>svg]:w-5! [&>svg]:h-5!"
            size="icon"
            icon={<ShoppingBag />}
          >
            <div className="badge absolute text-[10px] top-0 right-0 bg-primary font-normal rounded-full flex items-center justify-center w-4 h-4 text-white">
              {cart?.items?.length || "0"}
            </div>
          </ButtonDemo>
          {/* </Link> */}

          {authUser ? (
            <NavUserDemo triggerClassName=" rounded-full! h-10 w-10 [&_.user-details]:hidden" />
          ) : (
            <Link href={`/sign-in`}>
              <ButtonDemo text={`Sign In`} className=" bg-transparent! shadow-none text-gray-600 hover:text-gray-800" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
