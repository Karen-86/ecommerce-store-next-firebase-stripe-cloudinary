import React, { useEffect, useState, useMemo } from "react";
import { useProductStore } from "@/modules/products/store";
import { useCartStore } from "@/modules/carts/store";
import type { Product, ProductWithCart } from "@/modules/products/types";

const useProductsWithCart = ({ query = "" }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalCount: 0,
  });

  const cart = useCartStore((s) => s.cart);
  const getProductsAsync = useProductStore((s) => s.getProductsAsync);

  const productsWithCart = useMemo<ProductWithCart[]>(() => {
    return products.map((product) => {
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
    });
  }, [products, cart]);

  const fetchProducts = async () => {
    setIsLoading(true);

    const data: any = await getProductsAsync({ query });
    
    if (data.data.products) {
      setProducts(data.data.products);
      setPagination({
        totalPages: data.data.totalPages,
        totalCount: data.data.totalCount,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [query]);

  return { productsWithCart, pagination, isLoading };
};

export default useProductsWithCart;
