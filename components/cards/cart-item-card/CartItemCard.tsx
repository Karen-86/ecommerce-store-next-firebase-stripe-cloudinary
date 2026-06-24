"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { ButtonDemo, CheckboxDemo } from "@/components/index";
import LOCAL_DATA from "@/constants/localData";
import type { ProductWithCart } from "@/modules/products/types";
import { useCartStore } from "@/modules/carts/store";
import { useAuthStore } from "@/modules/auth/store";
import { ShoppingCartIcon, ShoppingBag, StarIcon, Minus, Plus, Trash } from "lucide-react";
import useProductWithCart from "@/modules/products/hooks/useProductWithCart";
import type { Cart, CartItemWithCheckbox } from "@/modules/carts/types";
import { alert } from "@/lib/utils/alert";

const { productImage, preloader } = LOCAL_DATA.images;

export const CartItemCard = ({
  cartItem,
  isInSheet = false,
  onClose,
  setCartItemsWithCheckbox = () => {},
}: {
  cartItem: CartItemWithCheckbox;
  isInSheet?: boolean;
  onClose?: () => void;
  setCartItemsWithCheckbox?: (_: any) => void;
}) => {
  const [imageURL, setImageURL] = useState(productImage);

  const deleteCartItemAsync = useCartStore((s) => s.deleteCartItemAsync);
  const authUser = useAuthStore((s) => s.authUser);

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCart = async () => {
    try {
      setIsDeleting(true);

      await deleteCartItemAsync({
        cartId: authUser?.uid,
        cartItemId: cartItem?.id,
        successCB: () => {
          alert("Removed from cart successfully!");
        },
        errorCB: (data: any) => {
          alert(data.message || "Something went wrong. Please try again!");
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (cartItem.productDetails === "unknown" || cartItem.variantDetails === "unknown") {
    return <CartPlaceholder {...{ cartItem, isInSheet, setCartItemsWithCheckbox, isDeleting, deleteCart }} />;
  }

  const productDetails = cartItem.productDetails;
  const variantDetails = cartItem.variantDetails;

  const variantPrimaryImage = productDetails.media.find((product: any) => product.id === variantDetails.primaryImage);

  return (
    <div
      className={`${isDeleting ? "opacity-50 pointer-events-none" : ""}  card cart-product-card border-b  flex gap-3 py-4`}
    >
      {!isInSheet && (
        <CheckboxDemo
          variant="dark"
          id={cartItem.id}
          className=""
          checked={cartItem.isSelected}
          onCheckedChange={(checked) => {
            setCartItemsWithCheckbox((prev: CartItemWithCheckbox[]) => {
              return prev.map((item) => ({
                ...item,
                isSelected: cartItem.id == item.id ? checked : item.isSelected,
              }));
            });
          }}
        />
      )}

      <Link
        href={`/products/${cartItem.productId}?variantId=${cartItem.variantDetails.id}`}
        className="card-header overflow-hidden"
        onClick={onClose}
      >
        <div className="card-image relative h-20 w-20  duration-600">
          <img
            src={imageURL}
            onError={() => setImageURL(productImage)}
            alt=""
            className="rounded-xl block absolute top-0 left-0 w-full h-full object-cover overflow-visible"
          />
          <img
            src={variantPrimaryImage?.url}
            onLoad={() => setImageURL(variantPrimaryImage?.url)}
            // onError={() => setImageURL(productImage)}
            alt=""
            className="hidden"
          />
        </div>
      </Link>

      <div className="card-body flex flex-col justify-between flex-1 ">
        <div className="row flex gap-3 items-start justify-between mb-4">
          <Link
            onClick={onClose}
            href={`/products/${cartItem.productId}?variantId=${cartItem.variantDetails.id}`}
            className="hover:text-primary duration-300 font-medium card-title text-sm"
          >
            <span className=" line-clamp-2">{cartItem.productDetails.title}</span>

            <div className=" flex gap-1 min-h-4">
              {Object.entries(cartItem.variantDetails.attributes).map(([key, value]: any, index, arr) => (
                <span key={key} className="text-xs text-secondary-v3">
                  {key}: {value}
                  {index !== arr.length - 1 && " / "}
                </span>
              ))}
            </div>
          </Link>
          <ButtonDemo
            onClick={deleteCart}
            size="icon-sm"
            icon={<Trash />}
            variant="ghostSecondary"
            className="rounded-full "
          />
          {/* <p className="card-description text-xs text-gray-500 mb-[1rem]">{product.description}</p> */}
        </div>

        <div className="row flex items-end justify-between gap-2">
          <div className="col">
            <div className="card-prices">
              <div className="card-price text-sm font-medium text-secondary-v2 line-through">
                ${Number(cartItem.variantDetails.compareAtPrice).toFixed(2)}
              </div>
              <div className="card-price text-sm font-medium">${Number(cartItem.variantDetails.price).toFixed(2)}</div>
            </div>
          </div>

          <div className="col">
            <QuantitySelector cartItem={cartItem} deleteCart={deleteCart} />
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPlaceholder = ({ cartItem, isInSheet, setCartItemsWithCheckbox, isDeleting, deleteCart }: any) => {
  return (
    <div
      className={`${isDeleting ? "opacity-50 pointer-events-none" : ""} card cart-product-card border-b  flex gap-3 py-4`}
    >
      {!isInSheet && (
        <CheckboxDemo
          variant="dark"
          id={cartItem.id}
          className=""
          checked={cartItem.isSelected}
          onCheckedChange={(checked) => {
            setCartItemsWithCheckbox((prev: CartItemWithCheckbox[]) => {
              return prev.map((item) => ({
                ...item,
                isSelected: cartItem.id == item.id ? checked : item.isSelected,
              }));
            });
          }}
        />
      )}
      <div className="card-header overflow-hidden">
        <div className="card-image relative h-20 w-20  duration-600">
          <img
            src={productImage}
            alt=""
            className="rounded-xl block absolute top-0 left-0 w-full h-full object-cover overflow-visible"
          />
        </div>
      </div>

      <div className="card-body flex flex-col justify-between flex-1 ">
        <div className="row flex gap-3 items-start justify-between mb-4">
          <div className="text-black/20 font-medium card-title text-sm">
            <span className=" line-clamp-2">This item is no longer available.</span>
          </div>
          <ButtonDemo
            onClick={deleteCart}
            size="icon-sm"
            icon={<Trash />}
            variant="ghostSecondary"
            className="rounded-full "
          />
        </div>
      </div>
    </div>
  );
};

const QuantitySelector = ({ cartItem, deleteCart }: { cartItem: CartItemWithCheckbox; deleteCart: () => void }) => {
  const updateCartItemAsync = useCartStore((s) => s.updateCartItemAsync);
  const authUser = useAuthStore((s) => s.authUser);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [localQuantity, setLocalQuantity] = useState(0);
  const [isEditingQty, setIsEditingQty] = useState(false);

  useEffect(() => {
    if (!isEditingQty) {
      setLocalQuantity(cartItem?.quantity ?? 0);
    }
  }, [cartItem?.quantity]);

  const updateQuantity = (next: number) => {
    if (!cartItem.variantDetails) return;

    if (next <= 0) {
      deleteCart();
      return;
    }

    // Optimistic UI
    setIsEditingQty(true);
    setLocalQuantity(next);

    clearTimeout(debounceRef.current as any);

    debounceRef.current = setTimeout(() => {
      try {
        updateCartItemAsync({
          cartId: authUser?.uid,
          cartItemId: cartItem.id,
          body: {
            // productId: productWithCart.id,
            // variantKey: getVariantKey(activeVariant.attributes || {}),
            quantity: next,
          },
          errorCB: (data: any) => {
            alert(data.message || "Something went wrong. Please try again!");
          },
        });
      } finally {
        setIsEditingQty(false);
      }
    }, 300);
  };

  const changeQty = (delta: number) => {
    if (cartItem.variantDetails === "unknown") return;
    let next = localQuantity + delta;
    if (next < 0) next = 0;
    if (next > (cartItem.variantDetails?.stock || 0)) {
      next = cartItem.variantDetails?.stock;
    }

    updateQuantity(next);
  };

  return (
    <div className={`flex items-center gap-3 `}>
      <div className="flex items-center gap-2 rounded-full border overflow-hidden shadow-sm">
        <ButtonDemo
          variant="ghost"
          icon={<Minus />}
          size="icon-sm"
          className="[&_svg]:h-3! rounded-none text-black"
          onClick={() => changeQty(-1)}
        />

        {/* <span className="w-10 text-center text-sm font-medium select-none">{quantity}</span> */}
        <input
          value={localQuantity}
          onChange={(e) => {
            if (cartItem.variantDetails === "unknown") return;
            const val = Number(e.target.value);

            if (isNaN(val)) return;

            let next = Math.max(0, val);

            if (cartItem.variantDetails?.stock != null) {
              next = Math.min(next, cartItem.variantDetails.stock);
            }

            updateQuantity(next);
          }}
          className=" w-3 text-center text-xs font-normal bg-transparent outline-none"
        />

        <ButtonDemo
          variant="ghost"
          icon={<Plus />}
          size="icon-sm"
          className="[&_svg]:h-3! rounded-none text-black"
          onClick={() => changeQty(+1)}
          disabled={cartItem.variantDetails !== "unknown" && localQuantity === cartItem.variantDetails?.stock}
        />
      </div>

      {/* <span className="text-xs">{cartItem.variantDetails?.stock ?? 0} in stock</span> */}
    </div>
  );
};
