import { create } from "zustand";
import type {  GalleryImage} from "@/modules/gallery-images/types";
import type { GalleryImagesApiResponse, GalleryImageApiResponse} from "./types";
import Stripe from "stripe";
import * as galleryImagesApi from "@/modules/gallery-images/api";

const noop = () => {};

type GalleryImagesStore = {
  galleryImages: GalleryImage[];
  isGalleryImagesLoading: boolean;
  isGalleryImagesCreating: boolean;
  // isProductUpdating: boolean;
  // isProductsDeleting: boolean;
  getGalleryImagesAsync: (params?: any) => Promise<GalleryImagesApiResponse>;
  // getProductAsync: (params?: any) => Promise<ProductApiResponse>;
  createGalleryImagesAsync: (params?: any) => Promise<GalleryImageApiResponse>;
  // updateProductAsync: (params?: any) => Promise<ProductApiResponse>;
  // deleteProductsAsync: (params?: any) => Promise<ProductsApiResponse>;
  // deleteProductAsync: (params?: any) => Promise<ProductApiResponse>;
};


export const useGalleryImagesStore = create<GalleryImagesStore>((set, get) => ({
  galleryImages: [],
  isGalleryImagesLoading: false,
  isGalleryImagesCreating: false,
  // isProductUpdating: false,
  // isProductsDeleting: false,
  getGalleryImagesAsync: async ({ query = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isGalleryImagesLoading: true });
    try {
      const data = await galleryImagesApi.getGalleryImages({ query });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =getGalleryImagesAsync=");

      set({ galleryImages: data.data.images });

      successCB(data);
      return data;
    } finally {
      set({ isGalleryImagesLoading: false });
    }
  },
  // getProductAsync: async ({ productId = "", successCB = noop, errorCB = noop }) => {
  //   const data = await galleryImagesApi.getProduct({ id: productId });

  //   if (!data.success) {
  //     errorCB(data);
  //     return data;
  //   }
  //   console.log(data, " =getProductAsync=");

  //   const product = data.data;

  //   const price = product.default_price as Stripe.Price;

  //   const formattedProduct = getProduct(product);

  //   successCB({ ...data, data: formattedProduct });
  //   return { ...data, data: formattedProduct };
  // },
  createGalleryImagesAsync: async ({ body = {}, successCB = noop, errorCB = noop } = {}) => {
    set({ isGalleryImagesCreating: true });

    try {
      const data = await galleryImagesApi.createGalleryImage({ body });

      if (!data.success) {
        errorCB(data);
        return data;
      }

      console.log(data, " =createGalleryImagesAsync=");

      get().getGalleryImagesAsync();

      successCB(data);
      return data;
    } finally {
      set({ isGalleryImagesCreating: false });
    }
  },
  // updateProductAsync: async ({productId = '', body = {}, successCB = noop, errorCB = noop } = {}) => {
  //   set({ isProductUpdating: true });

  //   try {
  //     const data = await galleryImagesApi.updateProduct({productId, body });

  //     if (!data.success) {
  //       errorCB(data);
  //       return data;
  //     }

  //     console.log(data, " =updateProductAsync=");

  //     get().getGalleryImagesAsync();

  //     successCB(data);
  //     return data;
  //   } finally {
  //     set({ isProductUpdating: false });
  //   }
  // },
  // deleteProductsAsync: async ({ query = "", successCB = noop, errorCB = noop } = {}) => {
  //   set({ isProductsDeleting: true });

  //   try {
  //     const data = await galleryImagesApi.deleteProducts({ query });

  //     if (!data.success) {
  //       errorCB(data);
  //       return data;
  //     }

  //     console.log(data, " =deleteProductsAsync=");

  //     get().getGalleryImagesAsync();

  //     successCB(data);
  //     return data;
  //   } finally {
  //     set({ isProductsDeleting: false });
  //   }
  // },
  // deleteProductAsync: async ({ productId = "", successCB = noop, errorCB = noop } = {}) => {
  //   set({ isProductsDeleting: true });

  //   try {
  //     const data = await galleryImagesApi.deleteProduct({ productId });

  //     if (!data.success) {
  //       errorCB(data);
  //       return data;
  //     }

  //     console.log(data, " =deleteProductAsync=");

  //     get().getGalleryImagesAsync();

  //     successCB(data);
  //     return data;
  //   } finally {
  //     set({ isProductsDeleting: false });
  //   }
  // },
}));
