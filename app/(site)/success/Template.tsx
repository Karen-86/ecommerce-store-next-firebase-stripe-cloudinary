"use client";

import React, { useEffect, useState, useRef } from "react";
import { ButtonDemo } from "@/components/index";
import Link from "next/link";
import LOCAL_DATA from "@/constants/localData";
import { ChevronLeft } from "lucide-react";
import { alert } from "@/lib/utils/alert";
import { useSearchParams } from "next/navigation";
import { useOrderStore } from "@/modules/orders/store";
import { useAuthStore } from "@/modules/auth/store";

const { successImage } = LOCAL_DATA.images;

const Template = () => {
  return (
    <main className="home-page">
      <HeroSection />
    </main>
  );
};

const HeroSection = () => {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);

  const getOrderAsync = useOrderStore((s) => s.getOrderAsync);
  const authUser = useAuthStore((s) => s.authUser);

  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;
    if (authUser === undefined) return;

    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const stop = () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };

    const guestId = JSON.parse(localStorage.getItem("cart") || "null")?.guestId;

    const checkOrder = async () => {
      await getOrderAsync({
        orderId,
        ...(guestId ? { query: `?guestId=${guestId}` } : {}),
        successCB: (data: any) => {
          if (data?.data?.paymentStatus === "paid" && !confirmedRef.current) {
            confirmedRef.current = true;
            setLoading(false);

            alert("Your order has been confirmed 🎉");

            stop();
          }
        },
        errorCB: (data: any) => {
          alert(data.message || "Something went wrong");

          stop();
        },
      });
    };

    alert("Payment received. Confirming your order...");

    checkOrder();
    interval = setInterval(checkOrder, 2000);

    timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);

      if (!confirmedRef.current) {
        alert("We received your payment and are still processing your order.");
      }
    }, 30000);

    return stop;
  }, [orderId, authUser]);

  return (
    <section className="min-h-screen pt-40!">
      <div className="container text-center">
        <img src={successImage} className="w-full h-full max-w-20 mx-auto mb-7" />
        <h2 className="text-3xl sm:text-4xl mb-5">SUCCESS</h2>
      </div>
    </section>
  );
};

export default Template;
