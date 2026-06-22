import React, { useEffect, useMemo, useState } from "react";
import { ButtonDemo, CarouselDemo, ProductCard } from "@/components/index";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product, ProductWithCart } from "@/modules/products/types";
import { motion } from "framer-motion";
import useProductsWithCart from "@/modules/products/hooks/useProductsWithCart";
import { useProductStore } from "@/modules/products/store";
import { useCartStore } from "@/modules/carts/store";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturesSection = () => {
  const [inView, setIsInView] = useState(false);

  const { productsWithCart, isLoading } = useProductsWithCart({ query: "?collections=featured" });

  return (
    <section id="features-section">
      <div className="container">
        <h2 className="text-3xl mb-7">Featured Products</h2>
        <motion.div
          onViewportEnter={() => setIsInView(true)}
          viewport={{ amount: 0.7 }}
          className={`${inView ? "lazy-animate" : ""} overflow-hidden`}
          data-lazy="fade-up"
        >
          {isLoading ? (
            <CarouselDemo
              className="custom-carousel"
              //   autoplay={true}
              itemClassName="min-[500px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              items={[{}, {}, {}, {}, {}]}
            >
              {({ item, index }: { item: any; index: any }) => <Skeleton className="min-h-[360px] w-full rounded-md" />}
            </CarouselDemo>
          ) : !productsWithCart.length ? (
             <p className="text-black/40 font-medium text-lg">Empty</p>
          ) : (
            <CarouselDemo
              className="custom-carousel"
              //   autoplay={true}
              itemClassName="min-[500px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              items={productsWithCart}
            >
              {({ item, index }: { item: any; index: any }) => <ProductCard product={item} className="min-h-[360px]" />}
            </CarouselDemo>
          )}
        </motion.div>

        <div className="flex justify-end mt-18">
          <Link href="/shop?collections=Featured">
            <ButtonDemo className="" variant="ghost" text="View All" endIcon={<ArrowRight />} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
