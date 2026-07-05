import { create } from "zustand";
import type { ProductWithCart, Product, ProductApi, StripeProduct } from "@/modules/products/types";
import type { ProductApiResponse, ProductsApiResponse } from "./types";
import Stripe from "stripe";
import * as productsApi from "@/modules/products/api";

const noop = () => {};

type ProductStore = {
  products: Product[];
  isProductsLoading: boolean;
  isProductCreating: boolean;
  isProductUpdating: boolean;
  isProductsDeleting: boolean;
  isProductsExporting: boolean;
  getProductsAsync: (params?: any) => Promise<ProductsApiResponse>;
  getProductAsync: (params?: any) => Promise<ProductApiResponse>;
  createProductAsync: (params?: any) => Promise<ProductApiResponse>;
  updateProductAsync: (params?: any) => Promise<ProductApiResponse>;
  deleteProductsAsync: (params?: any) => Promise<ProductsApiResponse>;
  deleteProductAsync: (params?: any) => Promise<ProductApiResponse>;
  exportProductsAsync: (params?: any) => Promise<ProductsApiResponse>;
};

const getProduct = (product: Product) => {
  return {
    // base
    id: product.id,
    slug: product.slug,
    title: product.title,
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
  isProductCreating: false,
  isProductUpdating: false,
  isProductsDeleting: false,
  isProductsExporting: false,
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
  createProductAsync: async ({ body = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isProductCreating: true });

    try {
      const data = await productsApi.createProduct({ body });

      if (!data.success) {
        errorCB(data);
        return data;
      }

      console.log(data, " =createProductAsync=");

      get().getProductsAsync();

      successCB(data);
      return data;
    } finally {
      set({ isProductCreating: false });
    }
  },
  updateProductAsync: async ({ productId = "", body = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isProductUpdating: true });

    try {
      const data = await productsApi.updateProduct({ productId, body });

      if (!data.success) {
        errorCB(data);
        return data;
      }

      console.log(data, " =updateProductAsync=");

      get().getProductsAsync();

      successCB(data);
      return data;
    } finally {
      set({ isProductUpdating: false });
    }
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

      get().getProductsAsync();

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

      get().getProductsAsync();

      successCB(data);
      return data;
    } finally {
      set({ isProductsDeleting: false });
    }
  },
  exportProductsAsync: async ({  successCB = noop, errorCB = noop } = {}) => {
    set({ isProductsExporting: true });

    try {
      const response = await productsApi.exportProducts({  });

      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "products.json";
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();

      console.log(response, " =exportProductsAsync=");

      successCB({ success: true, message: "Products exported successfully", data: null });
      return { success: true, message: "Products exported successfully", data: null };
    } catch (err) {
      const res = {
        success: false,
        message: "Failed to export products",
        data: null,
      };

      errorCB(res);
      return res;
    } finally {
      set({ isProductsExporting: false });
    }
  },
}));
