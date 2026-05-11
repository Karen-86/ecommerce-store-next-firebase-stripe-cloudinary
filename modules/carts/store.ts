import { create } from "zustand";
import type { Cart, CartBaseItem } from "@/modules/carts/types";
import Stripe from "stripe";
import * as productsApi from "@/modules/products/api";
import { useProductStore } from "../products/store";
import { ProductWithCart } from "../products/types";
import { v4 as uuidv4 } from "uuid";

const USER = null;

const noop = () => {};

type CartStore = {
  cart: Cart | null;
  isCartLoading: boolean;
  isCartCreating: boolean;
  isCartDeleting: boolean;
  isCartItemCreating: boolean;
  isCartItemUpdating: boolean;
  isCartItemDeleting: boolean;
  isCartSheetOpen: boolean;
  getCartAsync: (params?: any) => Promise<void>;
  createCartAsync: (params?: any) => Promise<void>;
  deleteCartAsync: (params?: any) => Promise<void>;
  createCartItemAsync: (params?: any) => Promise<any | null>;
  updateCartItemAsync: (params?: any) => Promise<any | null>;
  deleteCartItemAsync: (params?: any) => Promise<void>;
  setIsCartSheetOpen: (params?: any) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isCartLoading: true,
  isCartCreating: false,
  isCartDeleting: false,
  isCartItemCreating: false,
  isCartItemUpdating: false,
  isCartItemDeleting: false,
  isCartSheetOpen: false,

  getCartAsync: async ({ useId = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isCartLoading: true });
    try {
      if (USER) {
      } else {
        await new Promise((r) => setTimeout(() => r(false), 3000));

        let cart = JSON.parse(localStorage.getItem("cart") || "null");
        set({ cart: cart });
      }
    } finally {
      set({ isCartLoading: false });
    }
  },

  createCartAsync: async () => {
    try {
      set({ isCartItemUpdating: true });
    } finally {
      set({ isCartItemUpdating: false });
    }
  },

  deleteCartAsync: async () => {
    set({ isCartDeleting: true });

    try {
      await new Promise((r) => setTimeout(() => r(false), 300));


      localStorage.removeItem("cart");
      set({ cart:null });
    } finally {
      set({ isCartDeleting: false });
    }
  },

  createCartItemAsync: async ({ productId = "", variantKey = "", body = {} }) => {
    set({ isCartItemCreating: true });

    try {
      await new Promise((r) => setTimeout(() => r(false), 300));

      let cart: Cart = get().cart || { userId: "guest", items: [] };

      // const existingIndex = cart.items.findIndex(
      //   (item) => item.productId === productId && item.variantKey === variantKey,
      // );

      // if (existingIndex !== -1) {
      //   cart.items[existingIndex].quantity += body.quantity;
      // } else {
      // cart.items.push({
      //   productId,
      //   variantKey,
      //   quantity: body.quantity,
      //   variantDetails: body.variantDetails,
      //   productDetails: body.productDetails,
      // });
      // }

      cart = {
        ...cart,
        items: [
          ...cart.items,
          {
            id: uuidv4(),
            productId,
            variantKey,
            quantity: body.quantity,
            variantDetails: body.variantDetails,
            productDetails: body.productDetails,
          },
        ],
      };
      localStorage.setItem("cart", JSON.stringify(cart));
      set({ cart });
      return cart;
    } finally {
      set({ isCartItemCreating: false });
    }
  },

  updateCartItemAsync: async ({ productId = "", variantKey = "", body = {} }) => {
    set({ isCartItemUpdating: true });

    try {
      await new Promise((r) => setTimeout(() => r(false), 300));

      let cart: Cart = get().cart || { userId: "guest", items: [] };

      cart = {
        ...cart,
        items: cart.items.map((item) => {
          if (item.productId === productId && item.variantKey === variantKey) {
            return {
              ...item,
              quantity: body.quantity,
              // variant: body.variant,
            };
          }
          return item;
        }),
      };

      localStorage.setItem("cart", JSON.stringify(cart));
      set({ cart });
      return cart;
    } finally {
      set({ isCartItemUpdating: false });
    }
  },

  deleteCartItemAsync: async ({ productId = "", variantKey = "" }) => {
    set({ isCartItemDeleting: true });

    try {
      await new Promise((r) => setTimeout(() => r(false), 300));

      let cart: Cart = get().cart || { userId: "guest", items: [] };

      cart = {
        ...cart,
        items: cart.items.filter((item) => !(item.productId === productId && item.variantKey === variantKey)),
      };

      localStorage.setItem("cart", JSON.stringify(cart));
      set({ cart });
    } finally {
      set({ isCartItemDeleting: false });
    }
  },

  setIsCartSheetOpen: (isOpen) => set({ isCartSheetOpen: isOpen }),
}));
