

// import React, { useEffect, useState, useMemo } from "react";
// import { useProductStore } from "@/modules/products/store";
// import { useCartStore } from "@/modules/carts/store";
// import type { Product, ProductWithCart } from "@/modules/products/types";

// const useProductWithCart = ({ id = "" }: { id: any }) => {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const cart = useCartStore((s) => s.cart);
//   const getProductAsync = useProductStore((s) => s.getProductAsync);

//   const productWithCart = useMemo<ProductWithCart | null>(() => {
//     if (!id || !product) return null;

//     const productVariantsInCart = cart?.items?.filter((item) => item.productId === id);

//     let cartMap = null
//     if (productVariantsInCart) {
//        cartMap = Object.fromEntries(productVariantsInCart.map((item) => [item.variantKey, item]));
//     }

//     return {
//       ...product,

//       // extended with cart
//       cartMap,
//       isInCart: (productVariantsInCart?.length ?? 0) > 0,
//     };
//   }, [product, cart, id]);

//   const fetchProduct = async () => {
//     setIsLoading(true);

//     const data = await getProductAsync({ productId: id });
//     if (data.success) setProduct(data.data);

//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   return { productWithCart, isLoading };
// };

// export default useProductWithCart;



import React, {  useMemo } from "react";
import { useCartStore } from "@/modules/carts/store";
import type { Product, ProductWithCart } from "@/modules/products/types";

const useProductWithCart = ({ product }: { product: Product }) => {
  const cart = useCartStore((s) => s.cart);

  const productWithCart = useMemo<ProductWithCart | null>(() => {
    if (!product) return null;

    const productVariantsInCart = cart?.items?.filter((item) => item.productId === product.id);

    let cartMap = null;
    if (productVariantsInCart) {
      cartMap = Object.fromEntries(productVariantsInCart.map((item) => [item.variantKey, item]));
    }

    return {
      ...product,

      // extended with cart
      cartMap,
      isInCart: (productVariantsInCart?.length ?? 0) > 0,
    };
  }, [product, cart]);

  return { productWithCart };
};

export default useProductWithCart;