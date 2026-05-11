"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ButtonDemo, DialogDemo } from "@/components/index";
import LOCAL_DATA from "@/constants/localData";
import type { ProductWithCart } from "@/modules/products/types";
import { useCartStore } from "@/modules/carts/store";
import { ShoppingCartIcon, StarIcon, ShoppingBag } from "lucide-react";
import { DetailsSection } from "@/app/(site)/products/[id]/Template";
import useProductWithCart from "@/modules/products/hooks/useProductWithCart";

const { productImage, preloader } = LOCAL_DATA.images;

type ProductCardProp = {
  product: ProductWithCart;
  setProduct?: (data: ProductWithCart) => void;
  className?: string;
  successCB?: () => void;
};

export const ProductCard = ({ product, className }: ProductCardProp) => {
  const [imageURL, setImageURL] = useState(productImage);

  return (
    <div
      className={`${className} bg-white hover:[&_.card-image]:scale-110 hover:border-primary/20 hover:shadow-[0_0_10px_rgba(0,0,0,0.05)] duration-300 card product-card border border-primary/10 rounded-xl  flex flex-col`}
    >
      <Link
        href={`/products/${product.id}`}
        className="card-header px-5 py-2 border-b border-primary/10 overflow-hidden"
      >
        <div className="card-image relative pt-[80%] h-0 w-full duration-600">
          <img
            src={imageURL}
            onError={() => setImageURL(productImage)}
            alt=""
            className="rounded-xl block absolute top-0 left-0 w-full h-full object-cover overflow-visible"
          />
          <img
            src={product.primaryImage}
            onLoad={() => setImageURL(product.primaryImage)}
            // onError={() => setImageURL(productImage)}
            alt=""
            className="hidden"
          />
        </div>
      </Link>

      <div className="card-body p-5 flex flex-col justify-between flex-1">
        <div className="row">
          <p className="text-secondary-v2 text-xs font-medium mb-1.5 capitalize">{product.category}</p>
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
              <div className="card-price text-sm font-medium">${product.variants[0].price}</div>
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
            <DialogDemo
              contentClassName="sm:max-w-[1000px]! sm:overflow-y-hidden!"
              trigger={
                <ButtonDemo
                  className=" rounded-full"
                  variant={product.isInCart ? "default" : "outline"}
                  size="icon"
                  icon={<ShoppingCartIcon />}
                />
              }
            >
              {(closeDialog) => <DialogContent closeDialog={closeDialog} id={product.id} />}
            </DialogDemo>
          </div>
        </div>
      </div>
    </div>
  );
};

const DialogContent = ({ closeDialog = () => {}, id = "" }) => {
  const { productWithCart, isLoading } = useProductWithCart({ id });
  return (
    <div className="sm:max-h-[80vh] mb-5 sm:overflow-y-auto [&_.carousel-gallery-wrapper]:top-0 [&_section]:p-0!">
      <DetailsSection
        productWithCart={productWithCart}
        isLoading={isLoading}
        isInDialog={true}
      />

    </div>
  );
};
