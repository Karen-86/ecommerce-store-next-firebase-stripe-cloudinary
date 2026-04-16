"use client";

import React, { useState } from "react";
import { Header, Footer, ProductCard, ButtonDemo } from "@/components/index.js";
import type { Product } from "@/modules/products/types";
import LOCAL_DATA from "@/conststants/localData";
import Stripe from "stripe";
import { stripe } from "@/lib/Stripe";
// import { checkoutAction } from "@/modules/products/actions";
import * as productsApi from "@/modules/products/api";
import { redirect } from "next/navigation";
import { useProductStore } from "@/modules/products/store";
import { successAlert, errorAlert, warningAlert } from "@/lib/utils/alert"

const { exampleImage, preloader } = LOCAL_DATA.images;

const Template = () => {
  return (
    <main className="home-page pt-[150px] min-h-[100vh]">
      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  const products = useProductStore((s) => s.products);
  const isProductsLoading = useProductStore((s) => s.isProductsLoading);
  const [isLoading, setIsLoading] = useState(false);

  const cartProducts = products.filter((product) => product.isInCart);

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
    setIsLoading(true);
    // const res = await checkoutAction({ cartProducts });
    const res = await productsApi.checkout({ body: { cartProducts } });
    setIsLoading(false);

    if (!res.success) return errorAlert(res.message || "error");
    redirect(res.url!);
  };

  return (
    <section>
      <div className="container">
        <h2 className="text-3xl mb-[1rem]">Your Cart</h2>

        {!cartProducts.length ? (
          "Empty"
        ) : (
          <div className={`${isProductsLoading ? "pointer-events-none opacity-60" : ""} transition`}>
            <CartList products={products} />

            <div className="flex justify-end">
              <ButtonDemo
                disabled={isLoading}
                className="relative"
                startIcon={isLoading ? <img src={preloader} className=" w-[18px] h-[18px]" /> : null}
                onClick={handleCheckout}
                text={`Proceed to checkout`}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

type ProductListProps = {
  products: Product[];
};

const CartList = ({ products }: ProductListProps) => {
  const cartProducts = products.filter((product) => product.isInCart);
  return (
    <div className="">
      {cartProducts.map((product) => {
        return (
          <ProductCard
            key={product.id}
            product={product}
            className="sm:flex-row [&>.card-header]:flex-1 [&>.card-body]:flex-1 [&>.card-header]:max-w-[300px] mb-[1rem]"
          />
        );
      })}
    </div>
  );
};

export default Template;
