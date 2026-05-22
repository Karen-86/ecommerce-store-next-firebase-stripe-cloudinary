import { create } from "zustand";
import type { ProductWithCart, Product, StripeProduct } from "@/modules/products/types";
import type { CartBaseItem } from "@/modules/carts/types";
import Stripe from "stripe";
import * as productsApi from "@/modules/products/api";
import LOCAL_DATA from "@/constants/localData";
import { useCartStore } from "@/modules/carts/store";

const { exampleImage } = LOCAL_DATA.images;

const USER = null;

const noop = () => {};

type ProductStore = {
  getProductsAsync: (params?: any) => Promise<any[] | []>;
  getProductAsync: (params?: any) => Promise<any | null>;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  getProductsAsync: async ({ query = "", successCB = noop, errorCB = noop } = {}) => {
    const data = await productsApi.getProducts({ query });

    if (!data.success) {
      errorCB(data);
      return data;
    }
    console.log(data, " =getProductsAsync=");

    const formattedProducts = data.data.products.map((product: Product) => {
      return {
        // base
        id: product.id,
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

        // extended with product
        primaryImage: product.variants[0].images[0].url,
      };
    });

    successCB(data);
    // return { ...data.data, formattedProducts };
    return { ...data, data: {...data.data, products: formattedProducts} };
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

    const formattedData = {
      // base
      id: product.id,
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

      // extended with product
      primaryImage: product.variants[0].images[0].url,
    };

    successCB({ ...data, data: formattedData });
    return { ...data, data: formattedData };
  },
}));
