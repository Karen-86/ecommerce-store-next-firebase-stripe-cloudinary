"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonDemo } from "@/components/button/ButtonDemo";
import LOCAL_DATA from "@/conststants/localData";
import type { Product, StoredProduct } from "@/modules/products/types";
import { useProductStore } from "@/modules/products/store";
import { ShoppingCartIcon, StarIcon } from "lucide-react";

const { exampleImage } = LOCAL_DATA.images;
const { starIcon, emptyStarIcon } = LOCAL_DATA.svgs;

type ProductCardProp = {
  product: Product;
  setProduct?: (data: Product) => void;
  className?: string;
  successCB?: () => void;
};

export const ProductCard = ({ product, setProduct, className }: ProductCardProp) => {
  const [imageURL, setImageURL] = useState(product.images[0]);

  const setIsCartSheetOpen = useProductStore((s) => s.setIsCartSheetOpen);
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);
  const getProductAsync = useProductStore((s) => s.getProductAsync);

  const handleCartProducts = () => {
    let cart: StoredProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.some((item) => item.productId === product.id);

    if (exists) {
      cart = cart.filter((item) => item.productId !== product.id);
    } else {
      cart.push({ productId: product.id, quantity: product.quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    getProductsAsync({ successCB: () => !exists && setIsCartSheetOpen(true) });
    setProduct && getProductAsync({ productId: product.id, successCB: (data: any) => data && setProduct?.(data) });
  };

  return (
    <div
      className={`${className} hover:[&_.card-image]:scale-110 hover:border-primary/20 hover:shadow-[0_0_10px_rgba(0,0,0,0.05)] duration-300 card product-card border border-primary/10 rounded-xl  flex flex-col`}
    >
      <Link
        href={`/products/${product.id}`}
        className="card-header px-5 py-2 border-b border-primary/10 overflow-hidden"
      >
        <div className="card-image relative pt-[80%] h-0 w-full duration-600">
          <img
            src={imageURL}
            onError={() => setImageURL(exampleImage)}
            alt=""
            className="rounded-xl block absolute top-0 left-0 w-full h-full object-contain"
          />
        </div>
      </Link>

      <div className="card-body p-5 flex flex-col justify-between flex-1">
        <div className="row">
          <p className="text-secondary-v2 text-xs font-medium mb-1.5">Best Sellers</p>
          <Link
            href={`/products/${product.id}`}
            className="hover:text-primary duration-300 font-medium card-title flex-1 mb-[1rem] text-sm line-clamp-2   "
          >
            {product.name}
          </Link>
          {/* <p className="card-description text-xs text-gray-500 mb-[1rem]">{product.description}</p> */}
        </div>

        <div className="row flex items-end gap-2">
          <div className="col flex-1">
            <div className="card-prices flex gap-2 items-center mb-2">
              <div className="card-price text-sm font-medium text-secondary-v2 line-through">${(45).toFixed(2)}</div>
              <div className="card-price text-sm font-medium">${(product.price / 100).toFixed(2)}</div>
            </div>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < Math.round(product?.rating || 3.6) ? (
                    <StarIcon className="w-3.5 fill-current text-primary" />
                  ) : (
                    <StarIcon className="w-3.5 text-secondary-v2/50" />
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="col card-btns flex gap-3">
            <ButtonDemo
              onClick={handleCartProducts}
              className=" rounded-full"
              variant={product.isInCart ? "default" : "outline"}
              size="icon"
              icon={<ShoppingCartIcon />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
