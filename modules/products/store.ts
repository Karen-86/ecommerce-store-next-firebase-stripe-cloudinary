import { create } from "zustand";
import type { Product, ProductResponse, StoredProduct } from "@/modules/products/types";
// import * as blogsApi from "@/modules/blogs/api"
// import { getProductsAction, getProductAction } from "@/modules/products/actions";
import Stripe from "stripe";
import * as productsApi from '@/modules/products/api'

const noop = () => {};

type ProductStore = {
  products: Product[];
  isProductsLoading: boolean;
  isProductLoading: boolean;
  // isProductUpdating: boolean;
  isCartSheetOpen: boolean;
  getProductsAsync: (params?: any) => Promise<void>;
  getProductAsync: (params?: any) => Promise<void>;
  // updateProductAsync: (params?: any) => Promise<void>;
  setIsCartSheetOpen: (params?: any) => void;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isProductsLoading: false,
  isProductLoading: false,
  // isProductUpdating: false,
  isCartSheetOpen: false,

  getProductsAsync: async ({ successCB = noop, errorCB = noop } = {}) => {
    set({ isProductsLoading: true });

    try {
      // const data = await getProductsAction();
      const data = await productsApi.getProducts();

      if (!data.success) return errorCB(data.message);
      console.log(data, " =getProductsAsync=");

      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

      const filteredData = data.data.data.map((product: ProductResponse) => {
        const price = product.default_price as Stripe.Price;
        const storedProduct = cartItems.find((item: StoredProduct) => item.productId === product.id);

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          images: product.images,
          // price: (price.unit_amount! / 100).toFixed(2),
          price: price.unit_amount,
          quantity: storedProduct?.quantity || 1,
          isInCart: !!storedProduct,
        };
      });

      set({ products: filteredData });
      successCB(data.message);
    } finally {
      set({ isProductsLoading: false });
    }
  },

  getProductAsync: async ({ productId = "", successCB = noop, errorCB = noop }) => {
    set({ isProductLoading: true });

    try {
      // const data = await getProductAction({ id: productId });
      const data = await productsApi.getProduct({id: productId});

      if (!data.success) return errorCB(data.message);
      console.log(data, " =getProductAsync=");
      
      const product = data.data

      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      
      const price = product.default_price as Stripe.Price;
      const storedProduct = cartItems.find((item: StoredProduct) => item.productId === product.id);

      const filteredData = {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        // price: (price.unit_amount! / 100).toFixed(2),
        price: price.unit_amount,
        quantity: storedProduct?.quantity || 1,
        isInCart: !!storedProduct,
      };
      // set({ product: data.data })
      successCB(filteredData);
    } finally {
      set({ isProductLoading: false });
    }
  },

  // updateProductAsync: async ({ productId = "", isInCart = false, successCB = noop, errorCB = noop }) => {
  //   set({ isProductUpdating: true });

  //   try {
  //     const data = await updateProductAction({ id: productId, isInCart });

  //     if (!data.success) return errorCB(data.message);
  //     console.log(data, " =updateProductAsync=");

  //     await get().getProductsAsync();
  //     successCB(data.message || "Product has been updated successfully.");
  //   } finally {
  //     set({ isProductUpdating: false });
  //   }
  // },

  setIsCartSheetOpen: (isOpen) => set({ isCartSheetOpen: isOpen }),
}));
