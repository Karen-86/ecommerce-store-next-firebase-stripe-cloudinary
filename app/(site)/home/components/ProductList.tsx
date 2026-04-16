import React,{useRef} from 'react'
import type { Product } from '@/modules/products/types';
import { motion, useInView } from 'framer-motion';
import { ProductCard } from '@/components/index';


const ProductList = ({
  products = [],
  isProductsLoading = false,
}: {
  products: Product[];
  isProductsLoading: boolean;
}) => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    margin: "0px 0px -200px 0px", // triggers 200px BEFORE element enters view
    once: true,
  });

  return (
    <motion.div
      ref={ref}
      className={`${isInView ? "lazy-animate" : ""} ${isProductsLoading ? "pointer-events-none opacity-60" : ""} transition card-group products-card-group grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 gap-y-10`}
      data-lazy="fade-up"
    >
      {!products.length
        ? "Empty"
        : products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
    </motion.div>
  );
};

export default ProductList