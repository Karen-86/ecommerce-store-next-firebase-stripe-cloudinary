"use client";

import React, { useEffect, useState } from "react";
import { ButtonDemo, BreadcrumbDemo, TableSkeleton } from "@/components/index";
import { LOCAL_DATA } from "@/constants/index";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/modules/auth/store";
import { useProductStore } from "@/modules/products/store";
import { useUserStore } from "@/modules/users/store";
import { useOrderStore } from "@/modules/orders/store";
import type { Order } from "@/modules/orders/types";
import type { Product } from "@/modules/products/types";
import type { User } from "@/modules/users/types";
import { alert } from "@/lib/utils/alert";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import * as ordersApi from "@/modules/orders/api";
import * as productsApi from "@/modules/products/api";
import * as usersApi from "@/modules/users/api";


const {productImage} = LOCAL_DATA.images;

const breadcrumbItems = [
  {
    label: "Dashboard",
  },
];

const Page = () => {
  return (
    <main className="dashboard-page p-5 pt-1">
      <h2 className="mb-1 text-2xl">Dashboard</h2>
      <BreadcrumbDemo items={breadcrumbItems} />
      <br />

      <ShowcaseSection />

      <img src={productImage} className="absolute bottom-0 right-0  opacity-10" alt="" />
    </main>
  );
};

const ShowcaseSection = () => {
  const user = useAuthStore((s) => s.user);
  const authUser = useAuthStore((s) => s.authUser);

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [products, customers, orders]: any = await Promise.allSettled([
        productsApi.getProducts(),
        usersApi.getUsers(),
        ordersApi.getOrders(),
      ]);

      if (products.status === "fulfilled" && products.value.success) {
        setProducts(products.value.data.products);
      }

      if (customers.status === "fulfilled" && customers.value.success) {
        setCustomers(customers.value.data.users);
      }

      if (orders.status === "fulfilled" && orders.value.success) {
        setOrders(orders.value.data.orders);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // auth still loading
    if (authUser === undefined) return;

    fetchData();
  }, [authUser]);

  const paidRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.amount, 0)
    .toFixed(2);

  const pendingRevenue = orders
    .filter((order) => order.paymentStatus === "unpaid")
    .reduce((sum, order) => sum + order.amount, 0)
    .toFixed(2);

  return (
    <section className="pt-0!">
      {isLoading ? (
        <>
          <Card className="mb-5">
            <CardContent>
              <Skeleton className="min-h-32 w-full rounded-lg " />
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-5 mb-5">
            <Card className="flex-1">
              <CardContent className="">
                <Skeleton className="min-h-18 w-full rounded-lg " />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="">
                <Skeleton className="min-h-18 w-full rounded-lg " />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="">
                <Skeleton className="min-h-18 w-full rounded-lg " />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <Card className="flex-1">
              <CardContent>
                <Skeleton className="min-h-18 w-full rounded-lg " />
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent>
                <Skeleton className="min-h-18 w-full rounded-lg " />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          <Card className="mb-5 pt-5 pb-10">
            <CardContent>
              <div className="uppercase  tracking-widest text-[16px] text-black/25 mb-3">Sales Overview</div>
              <h2 className="text-2xl font-normal! mb-3">Welcome back, {user.displayName}</h2>
              <div className=" font-light">Protected data, order history, products are backed by Firestore.</div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-5 mb-5">
            <Card className="flex-1">
              <CardContent className="flex items-center gap-3 justify-between">
                <div>
                  <div className=" text-secondary-v3 mb-5">Products count</div>
                  <div className="text-2xl font-medium">{products.length}</div>
                </div>
                <Link href="/dashboard/products">
                  <ButtonDemo variant="ghostYellow" size="xs" text="View all" />
                </Link>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="flex items-center gap-3 justify-between">
                <div>
                  <div className=" text-secondary-v3 mb-5">Customers count</div>
                  <div className="text-2xl font-medium">{customers.length}</div>
                </div>
                <Link href="/dashboard/customers">
                  <ButtonDemo variant="ghostYellow" size="xs" text="View all" />
                </Link>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="flex items-center gap-3 justify-between">
                <div>
                  <div className=" text-secondary-v3 mb-5">Orders count</div>
                  <div className="text-2xl font-medium">{orders.length}</div>
                </div>
                <Link href="/dashboard/orders">
                  <ButtonDemo variant="ghostYellow" size="xs" text="View all" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <Card className="flex-1">
              <CardContent>
                <div className=" text-secondary-v3 mb-5">Revenue</div>
                <div className="text-2xl font-medium">${paidRevenue}</div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent>
                <div className=" text-secondary-v3 mb-5">Pending revenue</div>
                <div className="text-2xl font-medium">${pendingRevenue}</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  );
};

export default Page;
