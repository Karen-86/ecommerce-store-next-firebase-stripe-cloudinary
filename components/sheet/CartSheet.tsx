"use client";

import React, { useState, useEffect } from "react";
import { ControlledSheetDemo, ProductCard, ButtonDemo, CartItemCard } from "@/components/index";
import { useProductStore } from "@/modules/products/store";
import { useCartStore } from "@/modules/carts/store";
import Link from "next/link";
import { redirect } from "next/navigation";
import * as cartsApi from "@/modules/carts/api";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import LOCAL_DATA from "@/constants/localData";
import { subtotal, discount, total } from "@/modules/carts/utils/cartTotals";
import type { CartItemWithCheckbox } from "@/modules/carts/types";
import { v4 as uuidv4 } from "uuid";
import useCartItemsWithCheckbox from "@/modules/carts/hooks/useCartItemsWithCheckbox";

const { exampleImage, preloader } = LOCAL_DATA.images;

const CartSheet = () => {
  const cart = useCartStore((s) => s.cart);
  const isCartSheetOpen = useCartStore((s) => s.isCartSheetOpen);
  const setIsCartSheetOpen = useCartStore((s) => s.setIsCartSheetOpen);
  // const isProductsLoading = useProductStore((s) => s.isProductsLoading);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
    const { cartItemsWithCheckbox } = useCartItemsWithCheckbox();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // const res = await checkoutAction({ cartProducts });
    const selectedItems = cartItemsWithCheckbox.filter((item) => item.isSelected);
    const res = await cartsApi.checkout({ body: { cart: { items: selectedItems } } });
    setIsCheckingOut(false);

    if (!res.success) return errorAlert(res.message || "error");
    redirect(res.url!);
  };

  return (
    <ControlledSheetDemo
      title={`Shopping cart (${cart?.items?.length})`}
      // description="Lorem ipsum dolor."
      side="right"
      contentClassName=" overflow-y-auto "
      trigger=" "
      isOpen={isCartSheetOpen}
      setIsOpen={setIsCartSheetOpen}
    >
      {(onClose) => (
        <>
          <div className="px-4 flex-1">
            {!cartItemsWithCheckbox?.length
              ? "Empty"
              : cartItemsWithCheckbox.map((cartItem, index) => (
                  <CartItemCard key={index} cartItem={cartItem} isInSheet={true} onClose={onClose} />
                ))}
          </div>

          <div className="py-5 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-5">
              <div className="text-black/60">Subtotal</div>

              <div className="font-medium text-lg">${subtotal(cartItemsWithCheckbox)}</div>
            </div>
            <p className="text-xs text-secondary-v3 mb-5 text-center">
              Shipping and taxes will be calculated during checkout.
            </p>
            <div className="btn-group flex gap-2">
              <Link href="/cart" onClick={() => onClose()} className=" flex-1">
                <ButtonDemo className="w-full rounded-full" size="lg" variant="outline" text={`View Cart`} />
              </Link>
              <ButtonDemo
                disabled={!cart?.items?.length}
                size="lg"
                className="flex-1 rounded-full hover:bg-black/80"
                variant="dark"
                startIcon={isCheckingOut ? <img src={preloader} className=" w-[18px] h-[18px]" /> : null}
                onClick={handleCheckout}
                text={`Checkout`}
              />
            </div>
          </div>
        </>
      )}
    </ControlledSheetDemo>
  );
};

export default CartSheet;
