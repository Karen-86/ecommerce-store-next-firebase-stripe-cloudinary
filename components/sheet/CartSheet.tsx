"use client";

import React from "react";
import { ControlledSheetDemo, ProductCard, ButtonDemo } from "@/components/index";
import { useProductStore } from "@/modules/products/store";
import Link from "next/link";

const CartSheet = () => {
  const products = useProductStore((s) => s.products);
  const isCartSheetOpen = useProductStore((s) => s.isCartSheetOpen);
  const setIsCartSheetOpen = useProductStore((s) => s.setIsCartSheetOpen);
  const isProductsLoading = useProductStore((s) => s.isProductsLoading);

  return (
    <ControlledSheetDemo
      title="Menu"
      description="Lorem ipsum dolor."
      side="right"
      contentClassName=" overflow-y-auto "
      trigger=" "
      isOpen={isCartSheetOpen}
      setIsOpen={setIsCartSheetOpen}
    >
      {(onClose) => (
        <div className="p-4">
          <div>
            {!products.length
              ? "Empty"
              : products
                  .filter((product) => product.isInCart)
                  .map((product) => {
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        className="[&>.card-header]:max-w-25 [&_.card-btns]:hidden px-2! py-3! flex-row [&>.card-header]:flex-1 [&>.card-body]:flex-1 mb-4 [&_.card-price]:mb-0"
                      />
                    );
                  })}
          </div>
          <Link href="/cart" onClick={() => onClose()} className="">
            <ButtonDemo className="w-full" text={`Cart`} />
          </Link>
        </div>
      )}
    </ControlledSheetDemo>
  );
};

export default CartSheet;
