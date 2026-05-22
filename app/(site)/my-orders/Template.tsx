"use client";

import React, { useState, useEffect } from "react";
import { BreadcrumbDemo, OrderCard } from "@/components/index";
import { Card, CardContent } from "@/components/ui/card";
import { useOrderStore } from "@/modules/orders/store";
import { useAuthStore } from "@/modules/auth/store";
import type { Order } from "@/modules/orders/types";
import { alert } from "@/lib/utils/alert";

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
  const getOrdersAsync = useOrderStore((s) => s.getOrdersAsync);
  const authUser = useAuthStore((s) => s.authUser);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const guestId = JSON.parse(localStorage.getItem("cart") || "null")?.guestId;
      const data: any = await getOrdersAsync({ query: authUser ? `?userId=${authUser.uid}` : `?guestId=${guestId}` });
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
        <h2 className="text-xl mb-[1rem]">My Orders</h2>
        <Card className="">
          <CardContent className="px-8">
            {isLoading
              ? "Loading..."
              : !orders.length
                ? "Empty"
                : orders.map((order, index) => <OrderCard key={index} order={order} />)}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Template;
