"use client";

import React, { useEffect, useState } from "react";
import { Header, CheckboxDemo, CartItemCard, ButtonDemo, BreadcrumbDemo } from "@/components/index.js";
import LOCAL_DATA from "@/constants/localData";
import * as cartsApi from "@/modules/carts/api";
import { redirect } from "next/navigation";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useCartStore } from "@/modules/carts/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCartIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { subtotal, discount, total } from "@/modules/carts/utils/cartTotals";
import type { CartItemWithCheckbox } from "@/modules/carts/types";
import useCartItemsWithCheckbox from "@/modules/carts/hooks/useCartItemsWithCheckbox";
import { ClearCartDialog } from "./ClearCartDialog";

const { exampleImage, preloader } = LOCAL_DATA.images;

const Template = () => {
  const breadcrumbItems = [{ href: "/", label: "Home" }, { label: "Cart" }];

  return (
    <main className="cart-page pt-25   min-h-screen">
      <div className="container">
        <BreadcrumbDemo items={breadcrumbItems} />
      </div>
      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  const isCartLoading = useCartStore((s) => s.isCartLoading);
  const { cartItemsWithCheckbox, setCartItemsWithCheckbox, isAllCartItemsChecked, selectedCartItemsWithCheckbox } =
    useCartItemsWithCheckbox();

  return (
    <section className="pt-7!">
      <div className="container">
        {!!cartItemsWithCheckbox?.length && <h2 className="text-xl mb-4">Cart</h2>}

        {isCartLoading ? (
          <div className="flex gap-3 flex-col xl:items-start xl:flex-row">
            <Card className="flex-1">
              <CardContent>
                <Skeleton className="min-h-[150px] w-full rounded-lg mb-2" />
                <Skeleton className="min-h-[150px] w-full rounded-lg mb-2" />
                <Skeleton className="min-h-[150px] w-full rounded-lg mb-2" />
              </CardContent>
            </Card>

            <Card className="flex-1 xl:max-w-[350px]">
              <CardContent>
                <Skeleton className="min-h-[360px] w-full rounded-lg mb-2" />
              </CardContent>
            </Card>
          </div>
        ) : !cartItemsWithCheckbox?.length ? (
          <EmptyCart />
        ) : (
          <div className="flex gap-7 flex-col xl:items-start xl:flex-row">
            <CartList {...{ cartItemsWithCheckbox, setCartItemsWithCheckbox, isAllCartItemsChecked }} />
            <CartTotals
              {...{
                cartItemsWithCheckbox,
                setCartItemsWithCheckbox,
                isAllCartItemsChecked,
                selectedCartItemsWithCheckbox,
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

type CartItemsWithCheckboxProps = {
  cartItemsWithCheckbox: CartItemWithCheckbox[];
  setCartItemsWithCheckbox: (_: any) => void;
  isAllCartItemsChecked: boolean;
  selectedCartItemsWithCheckbox?: CartItemWithCheckbox[];
};

const CartList = ({
  cartItemsWithCheckbox = [],
  setCartItemsWithCheckbox = () => {},
  isAllCartItemsChecked = false,
}: CartItemsWithCheckboxProps) => {


  return (
    <Card className="flex-1">
      <CardContent>
        <div className="flex items-center gap-4 mb-5 mt-4">
          <CheckboxDemo
            className=""
            checked={isAllCartItemsChecked}
            onCheckedChange={() => {
              setCartItemsWithCheckbox((prev: CartItemWithCheckbox[]) => {
                return prev.map((item) => ({
                  ...item,
                  isSelected: !isAllCartItemsChecked,
                }));
              });
            }}
          />
          <div className="font-medium">Select All ({cartItemsWithCheckbox?.length})</div>
        </div>

        <Separator />

        {cartItemsWithCheckbox.map((cartItem, index) => {
          return <CartItemCard key={index} cartItem={cartItem} setCartItemsWithCheckbox={setCartItemsWithCheckbox} />;
        })}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-0 mt-4">
          <Link href="/shop" className="w-full sm:w-auto">
            <ButtonDemo
              variant="outline"
              className="rounded-full w-full sm:w-auto"
              size="lg"
              startIcon={<ArrowLeft />}
              text={`Contiunue Shopping`}
            />
          </Link>
          <ClearCartDialog />
        </div>
      </CardContent>
    </Card>
  );
};

const CartTotals = ({ selectedCartItemsWithCheckbox = [] }: CartItemsWithCheckboxProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cart = useCartStore((s) => s.cart);

  // const handleCheckout = async () => {
  //   try {
  //     const line_items = cartItems.map((cartItem: any) => ({
  //       price_data: {
  //         currency: "cad",
  //         product_data: { name: cartItem.name },
  //         unit_amount: Math.round(cartItem.price * 100), // Stripe expects amount in cents
  //       },
  //       quantity: cartItem.quantity,
  //     }));

  //     const res = await fetch("/api/checkout", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ line_items }),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       console.log("Checkout failed:", errorData);
  //       alert("Checkout failed. Please try again.");
  //       return;
  //     }

  //     const { id } = await res.json();
  //     window.location.href = `https://checkout.stripe.com/pay/${id}`;
  //   } catch (error) {
  //     console.log("Checkout error:", error);
  //     alert("An unexpected error occurred during checkout.");
  //   }
  // };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // const res = await checkoutAction({ cartProducts });
    // const selectedItems = cartItemsWithCheckbox.filter((item) => item.isSelected);
    const res = await cartsApi.checkout({ body: { cart: { items: selectedCartItemsWithCheckbox } } });
    setIsCheckingOut(false);

    if (!res.success) return errorAlert(res.message || "error");
    redirect(res.url!);
  };

  return (
    <Card className="flex-1 xl:max-w-[350px] min-h-[360px] sticky top-4">
      <CardContent>
        <h2 className="text-xl mb-7">Cart Totals</h2>

        <div className="row flex justify-between items-center gap-2 mb-7">
          <div className="col text-black/60">Subtotal</div>
          <div className="col ">${subtotal(selectedCartItemsWithCheckbox)}</div>
        </div>
        <div className="row flex justify-between items-center gap-2 mb-7">
          <div className="col text-black/60">Shipping</div>
          <div className="col ">$0.00</div>
        </div>
        {/* <div className="row flex justify-between items-center gap-2 mb-7">
        <div className="col text-black/60">Tax</div>
        <div className="col ">$0.00</div>
      </div> */}
        <div className="row flex justify-between items-center gap-2 mb-7">
          <div className="col text-green-600">Discount</div>
          <div className="col ">-${discount(selectedCartItemsWithCheckbox)}</div>
        </div>

        <Separator className="mb-6" />

        <div className="row flex justify-between items-center gap-2 mb-7">
          <h2 className="col text-xl">Total</h2>
          <div className="col text-xl font-semibold">${total(cart, selectedCartItemsWithCheckbox)}</div>
        </div>

        <ButtonDemo
          disabled={!selectedCartItemsWithCheckbox?.length}
          variant="dark"
          className="rounded-full mb-4 hover:bg-black/80 w-full"
          size="lg"
          startIcon={isCheckingOut ? <img src={preloader} className=" w-[18px] h-[18px]" /> : null}
          onClick={handleCheckout}
          text={`Proceed to checkout (${selectedCartItemsWithCheckbox?.length}) items`}
        />

        <div className="text-xs text-secondary-v3 text-center">Secure checkout</div>
      </CardContent>
    </Card>
  );
};

const EmptyCart = () => {
  return (
    <section className="empty-cart">
      <div className="container">
        <div className="max-w-120 mx-auto text-center">
          <div className="mx-auto mb-5 w-20 h-20 shadow-lg shadow-primary/20 border rounded-full flex items-center justify-center">
            <ShoppingCartIcon className="text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl mb-5">Your cart is empty</h2>
          <p className="sm:text-lg text-secondary-v3  mb-7">
            Looks like your cart is still empty. Browse our latest products and add your favorites to get started.
          </p>

          <Link href="/shop">
            <ButtonDemo className="rounded-full hover:bg-black/80" variant="dark" size="lg" text="Shop Now" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Template;
