import { create } from "zustand";
import type { ProductWithCart, Product, StripeProduct } from "@/modules/products/types";
import type {  ProductApiResponse } from './types'
import Stripe from "stripe";
import * as productsApi from "@/modules/products/api";

const noop = () => {};

type ProductStore = {
  products: Product[];
  isProductsLoading: boolean;
  isProductsDeleting: boolean;
  getProductsAsync: (params?: any) => Promise<ProductApiResponse>;
  getProductAsync: (params?: any) => Promise<ProductApiResponse>;
  deleteProductsAsync: (params?: any) => Promise<ProductApiResponse>;
  deleteProductAsync: (params?: any) => Promise<ProductApiResponse>;
};

const getProduct = (product: Product) => {
  return {
    // base
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    content: product.content,
    rating: product.rating,
    category: product.category,
    brand: product.brand,
    collections: product.collections,
    currency: product.currency,
    options: product.options,
    variants: product.variants,
    media: product.media,

    // extended with product
    // primaryImage: product.variants[0].images[0].url,
  };
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isProductsLoading: false,
  isProductsDeleting: false,
  getProductsAsync: async ({ query = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isProductsLoading: true });
    try {
      const data = await productsApi.getProducts({ query });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =getProductsAsync=");

      const formattedProducts = data.data.products.map((product: Product) => {
        return getProduct(product);
      });

      set({ products: formattedProducts });

      successCB({ ...data, data: { ...data.data, products: formattedProducts } });
      return { ...data, data: { ...data.data, products: formattedProducts } };
    } finally {
      set({ isProductsLoading: false });
    }
  },

  getProductAsync: async ({ productId = "", successCB = noop, errorCB = noop }) => {
    const data = await productsApi.getProduct({ id: productId });

    if (!data.success) {
      errorCB(data);
      return data;
    }
    console.log(data, " =getProductAsync=");

    const product = data.data;

    const price = product.default_price as Stripe.Price;

    const formattedProduct = getProduct(product);

    successCB({ ...data, data: formattedProduct });
    return { ...data, data: formattedProduct };
  },
  deleteProductsAsync: async ({ query = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isProductsDeleting: true });

    try {
      const data = await productsApi.deleteProducts({ query });

      if (!data.success) {
        errorCB(data);
        return data;
      }

      console.log(data, " =deleteProductsAsync=");

      get().getProductsAsync()

      successCB(data);
      return data;
    } finally {
      set({ isProductsDeleting: false });
    }
  },
  deleteProductAsync: async ({ productId = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isProductsDeleting: true });

    try {
      const data = await productsApi.deleteProduct({ productId });

      if (!data.success) {
        errorCB(data);
        return data;
      }

      console.log(data, " =deleteProductAsync=");

      get().getProductsAsync()

      successCB(data);
      return data;
    } finally {
      set({ isProductsDeleting: false });
    }
  },
}));
