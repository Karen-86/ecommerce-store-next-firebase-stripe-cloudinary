"use client"

import React, { useEffect, useState } from "react"
import { useUserStore } from "@/modules/users/store"
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
import { LOCAL_DATA } from "@/constants/index"

const {} = LOCAL_DATA.images

  const breadcrumbItems = [

    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      label: `Orders`,
    },
  ];

const Page = () => {


  return (
    <main className="orders-page p-5 pt-1">
      <h2 className="mb-1 text-2xl">Dashboard</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />

      <ShowcaseSection/>
    </main>
  )
}

const ShowcaseSection = () => {
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getOrdersAsync = useOrderStore((s) => s.getOrdersAsync);
  const authUser = useAuthStore((s) => s.authUser);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const data: any = await getOrdersAsync();
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
    <section className="pt-0!">
        {isLoading ? (
         <>
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
            <Card className="">
              <CardContent className="px-8">
                {orders.map((order, index) => (
                  <OrderCard key={index} order={order}  />
                ))}
              </CardContent>
            </Card>
          </>
        )}
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

        </div>
      </div>
    </section>
  );
};

export default Page
