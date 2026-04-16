"use client";

import React, { useState, useEffect } from "react";
import LOCAL_DATA from "@/conststants/localData";
import { ButtonDemo, CommandPopoverDemo, CommandDialogDemo } from "@/components/index.js";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { SidebarNavigationMenuDemo } from "./SidebarNavigationMenuDemo";
import { useProductStore } from "@/modules/products/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SearchProduct } from "@/modules/products/types";
import { ShoppingBag, Search } from "lucide-react";

const { logo, exampleImage } = LOCAL_DATA.images;
const { cartIcon, accountIcon } = LOCAL_DATA.svgs;

export const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Shop", href: "/shop" },
];

export default function Navbar() {
  const products = useProductStore((s) => s.products);
  const [SearchProducts, setSearchProducts] = useState<SearchProduct[] | []>([]);

  const router = useRouter();

  useEffect(() => {
    if (!products.length) return;

    // const filteredData = products.map((product, index) => ({
    //   id: product.id,
    //   label: product.name,
    //   value: product.name,
    //   startIcon: <img className="w-4" src={product.images[0] || exampleImage} alt="" />,
    //   // endIcon: homeIcon,
    //   isSelected: index == 3,
    // }));

    const filteredData = products.map((product:any) => {
      return {
        label: product.name,
        value: product.id,
        price: '$' + (product.price / 100).toFixed(2),
        description: product.description,
        startIcon: <img className="w-full h-full object-contain" src={product.images[0] || exampleImage} alt="" />,
      };
    });

    setSearchProducts(filteredData);
  }, [products]);

  const routeCallback = (item: { value: string }) => {
    router.push(item.value as string);
    console.log(item.value);
  };

  return (
    <nav className="navbar absolute top-0 w-full z-3 border-b border-primary/10 pr-[10px]">
      <div className="container  py-3 flex items-center justify-between ">
        <a href="/">
          <img src={logo} alt="" className="max-w-[50px] h-auto " />
        </a>

        <NavigationMenuDemo />

        <SidebarNavigationMenuDemo />

        <div className="btn-group hidden lg:flex">
          {/* <CommandPopoverDemo defaultItems={SearchProducts} callback={routeCallback} className="min-w-70" /> */}
          <CommandDialogDemo defaultItems={SearchProducts} callback={routeCallback} />
          <Link href="/cart">
            <ButtonDemo
              className="rounded-full bg-transparent! shadow-none text-gray-600 hover:text-gray-800 relative [&>svg]:w-5! [&>svg]:h-5!"
              size="icon"
              icon={<ShoppingBag />}
            >
              <div className="badge absolute text-xs top-0 right-0 bg-primary rounded-full flex items-center justify-center w-4 h-4 text-white">
                {products.filter((product) => product.isInCart).length || "0"}
              </div>
            </ButtonDemo>
          </Link>
          <Link href="/sign-in">
            <ButtonDemo
              className="rounded-full bg-transparent! shadow-none gap-1 text-gray-600 hover:text-gray-800 relative [&>svg]:w-5! [&>svg]:h-5!"
              // size="icon"
              // icon={accountIcon}
            >
              Sign In
            </ButtonDemo>
          </Link>
        </div>
      </div>
    </nav>
  );
}
