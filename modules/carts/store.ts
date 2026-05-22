import { create } from "zustand";
import type { Cart, CartBaseItem } from "@/modules/carts/types";
import * as cartsApi from "@/modules/carts/api";
import { useAuthStore } from "../auth/store";
import { v4 as uuidv4 } from "uuid";

const noop = () => {};

type CartStore = {
  cart: Cart | null;
  cartMode: "guest" | "user" | null;
  isCartLoading: boolean;
  isCartCreating: boolean;
  isCartDeleting: boolean;
  isCartItemCreating: boolean;
  isCartItemUpdating: boolean;
  isCartItemDeleting: boolean;
  isCartSheetOpen: boolean;
  setCartMode: (params?: any) => void;
  getCartAsync: (params?: any) => Promise<void>;
  createCartAsync: (params?: any) => Promise<void>;
  deleteCartAsync: (params?: any) => Promise<void>;
  attachGuestCartItemsAsync: (params?: any) => Promise<any | null>;
  createCartItemAsync: (params?: any) => Promise<any | null>;
  updateCartItemAsync: (params?: any) => Promise<any | null>;
  deleteCartItemAsync: (params?: any) => Promise<any | null>;
  setIsCartSheetOpen: (params?: any) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  cartMode: null,
  isCartLoading: true,
  isCartCreating: false,
  isCartDeleting: false,
  isCartItemCreating: false,
  isCartItemUpdating: false,
  isCartItemDeleting: false,
  isCartSheetOpen: false,

  setCartMode: async ({ successCB = noop, errorCB = noop } = {}) => {
    const { authUser } = useAuthStore.getState();

    if (authUser) {
      set({ cartMode: "user" });

      let guestCart = JSON.parse(localStorage.getItem("cart") || "null");

      if (guestCart) {
        await get().attachGuestCartItemsAsync({ cartId: authUser?.uid, body: { guestCartItems: guestCart.items } });
        localStorage.removeItem("cart");
      }
    } else {
      set({ cartMode: "guest" });
    }

    await get().getCartAsync({ cartId: authUser?.uid });

    successCB();
  },

  getCartAsync: async ({ cartId = "", successCB = noop, errorCB = noop } = {}) => {
    set({ isCartLoading: true });

    try {
      // Firestore
      if (get().cartMode === "user") {
        const data = await cartsApi.getCart({ cartId });

        if (!data.success) {
          errorCB(data);
          return data;
        }
        console.log(data, " =getCartAsync=");

        set({ cart: data.data });
        successCB(data);
      }

      // LocalStorage
      else {
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

  deleteCartAsync: async ({ cartId = "", successCB = noop, errorCB = noop }) => {
    set({ isCartDeleting: true });

    try {
      // Firestore
      if (get().cartMode === "user") {
        const data = await cartsApi.deleteCart({ cartId });

        if (!data.success) {
          errorCB(data);
          return data;
        }
        console.log(data, " =deleteCartAsync=");

        set({ cart: null });
        successCB({ ...data, message: "Your cart has been cleared." });
      }

      // LocalStorage
      else {
        await new Promise((r) => setTimeout(() => r(false), 300));

        localStorage.removeItem("cart");
        set({ cart: null });
        successCB("Your cart has been cleared.");
      }
    } finally {
      set({ isCartDeleting: false });
    }
  },

  attachGuestCartItemsAsync: async ({ cartId = "", body = {}, successCB = noop, errorCB = noop }) => {
    set({ isCartItemCreating: true });
    try {
      const data = await cartsApi.attachGuestCartItems({ cartId, body });

      if (!data.success) {
        errorCB(data);
        return data;
      }
      console.log(data, " =attachGuestCartItemsAsync=");

      set({ cart: data.data });
      successCB({ ...data, message: "Attached to cart successfully!" });
    } finally {
      set({ isCartItemCreating: false });
    }
  },

  createCartItemAsync: async ({ cartId = "", body = {}, successCB = noop, errorCB = noop }) => {
    set({ isCartItemCreating: true });

    try {
      // Firestore
      if (get().cartMode === "user") {
        const data = await cartsApi.createCartItem({ cartId, body });

        if (!data.success) {
          errorCB(data);
          return data;
        }
        console.log(data, " =createCartItemAsync=");

        set({ cart: data.data });
        successCB({ ...data, message: "Added to cart successfully!" });
      }

      // LocalStorage
      else {
        await new Promise((r) => setTimeout(() => r(false), 300));

        let cart: Cart = get().cart || { guestId: `guest-${Date.now()}`, items: [] };

        cart = {
          ...cart,
          items: [
            ...cart.items,
            {
              id: uuidv4(),
              productId: body.productId,
              variantKey: body.variantKey,
              quantity: body.quantity,
              variantDetails: body.variantDetails,
              productDetails: body.productDetails,
            },
          ],
        };

        localStorage.setItem("cart", JSON.stringify(cart));

        set({ cart });
        successCB("Added to cart successfully!");
      }
    } finally {
      set({ isCartItemCreating: false });
    }
  },

  updateCartItemAsync: async ({ cartId = "", cartItemId = "", body = {}, successCB = noop, errorCB = noop }) => {
    set({ isCartItemUpdating: true });

    try {
      // Firestore
      if (get().cartMode === "user") {
        const data = await cartsApi.updateCartItem({ cartId, cartItemId, body });

        if (!data.success) {
          errorCB(data);
          return data;
        }
        console.log(data, " =updateCartItemAsync=");

        set({ cart: data.data });
        successCB({ ...data, message: "Updated successfully!" });
      }

      // LocalStorage
      else {
        await new Promise((r) => setTimeout(() => r(false), 300));

        let cart: Cart = get().cart || { guestId: `guest-${Date.now()}`, items: [] };

        cart = {
          ...cart,
          items: cart.items.map((item) => {
            if (item.id === cartItemId) {
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
        successCB("Updated successfully!");
      }
    } finally {
      set({ isCartItemUpdating: false });
    }
  },

  deleteCartItemAsync: async ({ cartId = "", cartItemId = "", successCB = noop, errorCB = noop }) => {
    set({ isCartItemDeleting: true });

    try {
      // Firestore
      if (get().cartMode === "user") {
        const data = await cartsApi.deleteCartItem({ cartId, cartItemId });
        if (!data.success) {
          errorCB(data);
          return data
        }
        console.log(data, " =deleteCartItemAsync=");
        set({ cart: data.data });
        successCB({ ...data, message: "Deleted successfully!" });
      }

      // LocalStorage
      else {
        await new Promise((r) => setTimeout(() => r(false), 300));

        let cart: Cart = get().cart || { guestId: `guest-${Date.now()}`, items: [] };

        cart = {
          ...cart,
          items: cart.items.filter((item) => item.id !== cartItemId),
        };

        localStorage.setItem("cart", JSON.stringify(cart));

        set({ cart });
        successCB("Deleted successfully!");
      }
    } finally {
      set({ isCartItemDeleting: false });
    }
  },

  setIsCartSheetOpen: (isOpen) => set({ isCartSheetOpen: isOpen }),
}));
