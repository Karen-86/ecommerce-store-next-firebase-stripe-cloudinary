import React,{useState} from "react";
import { useProductStore } from "@/modules/products/store";
import ProductList from "../components/ProductList";
import { ButtonDemo, CarouselDemo, ProductCard } from "@/components/index";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/modules/products/types";
import { motion } from "framer-motion";

const TrendsSection = () => {
  const products = useProductStore((s) => s.products);
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);
    const isProductsLoading = useProductStore((s) => s.isProductsLoading);
    
      const [inView, setIsInView] = useState(false);

  return (
    <section>
      <div className="container">
        <h2 className="text-3xl mb-7">Trending Products</h2>
        <motion.div
          onViewportEnter={() => setIsInView(true)}
          viewport={{ amount: 0.7 }}
          className={`${inView ? "lazy-animate" : ""}`}
          data-lazy="fade-up"
        >
          <CarouselDemo
            className="custom-carousel"
            //   autoplay={true}
            itemClassName="min-[500px]:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            items={products}
          >
            {({ item, index }: { item: any; index: any }) => <ProductCard product={item} className="min-h-[350px]" />}
          </CarouselDemo>
        </motion.div>

        <div className="flex justify-end mt-18">
          <Link href="/shop?productType=trending_products">
            <ButtonDemo className="" variant="ghost" text="View All" endIcon={<ArrowRight />} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendsSection