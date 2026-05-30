"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Header,
  CheckboxDemo,
  CartItemCard,
  ButtonDemo,
  BreadcrumbDemo,
  DropdownMenuCheckboxes,
} from "@/components/index.js";
import LOCAL_DATA from "@/constants/localData";
import * as cartsApi from "@/modules/carts/api";
import { redirect } from "next/navigation";
import { alert, successAlert, errorAlert, warningAlert } from "@/lib/utils/alert";
import { useCartStore } from "@/modules/carts/store";
import { useAuthStore } from "@/modules/auth/store";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/modules/users/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCartIcon, ArrowLeft, MapPin, Plus, Pen, Trash } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { subtotal, discount, total } from "@/modules/carts/utils/cartTotals";
import type { CartItemWithCheckbox } from "@/modules/carts/types";
import useCartItemsWithCheckbox from "@/modules/carts/hooks/useCartItemsWithCheckbox";
import { ClearCartDialog } from "./ClearCartDialog";
import AddressFormSheet from "@/components/sheet/AddressFormSheet";

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
        {isCartLoading ? (
         <>
           <h2 className="text-xl mb-4">Cart</h2>
           <div className="flex gap-3 flex-col lg:items-start lg:flex-row">
             <Card className="flex-1">
               <CardContent>
                 <Skeleton className="min-h-[150px] w-full rounded-lg mb-2" />
                 <Skeleton className="min-h-[150px] w-full rounded-lg mb-2" />
                 <Skeleton className="min-h-[150px] w-full rounded-lg mb-2" />
               </CardContent>
             </Card>
          
             <Card className="flex-1 lg:max-w-[350px]">
               <CardContent>
                 <Skeleton className="min-h-[360px] w-full rounded-lg mb-2" />
               </CardContent>
             </Card>
           </div>
         </>
        ) : !cartItemsWithCheckbox?.length ? (
          <EmptyCart />
        ) : (
          <>
            <h2 className="text-xl mb-4">Cart</h2>
            <div className="flex gap-7 flex-col lg:items-start lg:flex-row">
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
          </>
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
  const isTargetUserAddressUpdating = useUserStore((s) => s.isTargetUserAddressUpdating);
  const isTargetUserAddressDeleting = useUserStore((s) => s.isTargetUserAddressDeleting);

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
    const res = await cartsApi.checkout({
      body: {
        cart: {
          ...(cart?.guestId ? { guestId: cart?.guestId } : {}),
          items: selectedCartItemsWithCheckbox,
        },
      },
    });
    setIsCheckingOut(false);

    if (!res.success) return errorAlert(res.message || "error");
    redirect(res.data.url!);
  };

  return (
    <Card className="flex-1 lg:max-w-[350px] min-h-[360px] sticky top-4">
      <CardContent>
        <h2 className="text-xl mb-7">Order Summary</h2>

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

        <Addresses />

        <Separator className="mb-6" />

        <div className="row flex justify-between items-center gap-2 mb-7">
          <h2 className="col text-xl">Total</h2>
          <div className="col text-xl font-semibold">${total(cart, selectedCartItemsWithCheckbox)}</div>
        </div>

        <ButtonDemo
          disabled={
            !selectedCartItemsWithCheckbox?.length || isTargetUserAddressUpdating || isTargetUserAddressDeleting
          }
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

const Addresses = () => {
  const [addressList, setAddressList] = useState<any>([]);

  const [openDropdown, setOpenDropdown] = useState(false);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [addressFormSheetIsOpen, setAddressFormSheetIsOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const updateTargetUserAddressAsync = useUserStore((s) => s.updateTargetUserAddressAsync);
  const deleteTargetUserAddressAsync = useUserStore((s) => s.deleteTargetUserAddressAsync);
  const isTargetUserAddressUpdating = useUserStore((s) => s.isTargetUserAddressUpdating);
  const isTargetUserAddressDeleting = useUserStore((s) => s.isTargetUserAddressDeleting);

  const defaultAddress = user?.addresses?.find((address: any) => address.isDefault);

  useEffect(() => {
    if (!user) return;
    setAddressList(
      user.addresses?.map((address) => {
        return {
          id: address.id,
          name: [address.streetAddress, address.country, address.city, address.state, address.postalCode]
            .filter(Boolean)
            .join(", "),
          isChecked: address.isDefault,
          startIcon: <MapPin />,
        };
      }),
    );
  }, [user]);

  return (
    <div className="addresses">
      <div className="flex  items-center justify-be mb-1">
        <MapPin className="text-black/60 h-4" />
        <div className="text-xs uppercase tracking-wide font-medium w-fit text-secondary-v2 flex-1">
          SHIPPING ADDRESS
        </div>

        <DropdownMenuCheckboxes
          items={addressList}
          onCheckedChange={({ isChecked, checkboxId }) => {
            let tempItems = [...addressList];
            tempItems = tempItems.map((item) => ({
              ...item,
              isChecked: item.id === checkboxId ? isChecked : false,
            }));
            setAddressList(tempItems);
            updateTargetUserAddressAsync({
              userId: user.id,
              addressId: checkboxId,
              query: "?action=setDefaultAddress",
            });
          }}
          triggerClassName={``}
          contentClassName={``}
          checkboxItemClassName="min-h-15"
          trigger={<ButtonDemo text="Change" variant="ghostStrong" size="xs" />}
          side="bottom"
          align="end"
          open={openDropdown}
          setOpen={setOpenDropdown}
        >
          <ButtonDemo
            startIcon={<Plus />}
            text="Add new address"
            variant="ghostStrong"
            className="w-full min-h-11 rounded-none"
            onClick={() => {
              if (!Object.keys(user).length) {
                return alert("Sign in to add address");
              }

              setEditingItem(null);
              setOpenDropdown(false);
              setAddressFormSheetIsOpen(true);
            }}
          />
        </DropdownMenuCheckboxes>
        <AddressFormSheet
          {...{
            isOpen: addressFormSheetIsOpen,
            setIsOpen: setAddressFormSheetIsOpen,
            editingItem,
            setEditingItem,
          }}
        />
      </div>

      <div
        className={`flex flex-col border rounded-xl p-4 mb-4 min-h-27 text-xs ${isTargetUserAddressUpdating || isTargetUserAddressDeleting ? "animate-pulse bg-black/5 opacity-70 pointer-events-none" : ""}`}
      >
        {defaultAddress ? (
          <>
            <div className="leading-4 flex-1 mb-3">
              {[
                defaultAddress.streetAddress,
                defaultAddress.country,
                defaultAddress.city,
                defaultAddress.state,
                defaultAddress.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>

            <div className="flex justify-end">
              <ButtonDemo
                onClick={() => {
                  setEditingItem(defaultAddress);
                  setAddressFormSheetIsOpen(true);
                }}
                className="rounded-full"
                variant="ghostSecondary"
                size="icon-sm"
                icon={<Pen />}
              />
              <ButtonDemo
                onClick={() => {
                  deleteTargetUserAddressAsync({ userId: user.id, addressId: defaultAddress.id });
                }}
                className="rounded-full"
                variant="ghostSecondary"
                size="icon-sm"
                icon={<Trash />}
              />
            </div>
          </>
        ) : (
          <div className="text-black/60 text-xs text-secondary-v3 flex-1">No address found.</div>
        )}
      </div>
    </div>
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
