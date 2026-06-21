"use client";

import React, { useState, useEffect } from "react";
import { BreadcrumbDemo, OrderCard, ButtonDemo } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderStore } from "@/modules/orders/store";
import { useAuthStore } from "@/modules/auth/store";
import type { Order } from "@/modules/orders/types";
import { alert } from "@/lib/utils/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import Link from "next/link";
import * as ordersApi from "@/modules/orders/api";

const Template = () => {
  const breadcrumbItems = [{ href: "/", label: "Home" }, { label: "My Orders" }];

  return (
    <main className="my-orders-page pt-25  min-h-screen">
      <div className="container ">
        <BreadcrumbDemo items={breadcrumbItems} />
      </div>
      <ShowcaseSection />
    </main>
  );
};

const ShowcaseSection = () => {
  const authUser = useAuthStore((s) => s.authUser);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const guestId = JSON.parse(localStorage.getItem("cart") || "null")?.guestId;
      const data: any = await ordersApi.getOrders({ query: authUser ? `?userId=${authUser.uid}` : `?guestId=${guestId}` });
      if (!data.success) return alert(data.message || "Something went wrong");

      setOrders(data.data.orders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    fetchData();
  }, [authUser]);

  return (
    <section className="pt-7!">
      <div className="container">
        {isLoading ? (
         <>
            <h2 className="text-xl mb-[1rem]">My Orders</h2>
           <Card className="">
             <CardContent className="px-8">
               <Skeleton className="min-h-70 md:min-h-25 w-full rounded-lg mb-2" />
               {/* <Separator className="my-2" /> */}
               <Skeleton className="min-h-70 md:min-h-25 w-full rounded-lg mb-2" />
               {/* <Separator className="my-2" /> */}
               <Skeleton className="min-h-70 md:min-h-25 w-full rounded-lg" />
             </CardContent>
           </Card>
         </>
        ) : !orders.length ? (
          <EmptyCart />
        ) : (
          <>
            <h2 className="text-xl mb-[1rem]">My Orders</h2>
            <Card className="">
              <CardContent className="px-8">
                {orders.map((order, index) => (
                  <OrderCard key={index} order={order} />
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </section>
  );
};

const EmptyCart = () => {
  return (
    <section className="empty-cart">
      <div className="container">
        <div className="max-w-120 mx-auto text-center">
          <div className="mx-auto mb-5 w-20 h-20 shadow-lg shadow-primary/20 border rounded-full flex items-center justify-center">
            <Package className="text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl mb-5">No Orders Yet</h2>
          <p className="sm:text-lg text-secondary-v3  mb-7">You haven't placed any orders yet.</p>

          <Link href="/shop">
            <ButtonDemo className="rounded-full hover:bg-black/80" variant="dark" size="lg" text="Start Shopping" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Template;
