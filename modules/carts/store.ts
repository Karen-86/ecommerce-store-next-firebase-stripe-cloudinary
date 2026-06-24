import { create } from "zustand";
import type { Cart, CartApi, CartsApiResponse, CartApiResponse } from "@/modules/carts/types";
import * as cartsApi from "@/modules/carts/api";
import { useAuthStore } from "../auth/store";
import { useProductStore } from "../products/store";
import { v4 as uuidv4 } from "uuid";
// import { enrichCartWithProducts } from "@/lib/server/utils/enrichCartWithProducts";

const noop = () => {};

type CartStore = {
  cart: CartApi | Cart | null;
  cartMode: "guest" | "user" | null;
  isCartLoading: boolean;
  isCartCreating: boolean;
  isCartDeleting: boolean;
  isCartItemCreating: boolean;
  isCartItemUpdating: boolean;
  isCartItemDeleting: boolean;
  isCartSheetOpen: boolean;
  setCartMode: (params?: any) => void;
  getCartAsync: (params?: any) => Promise<CartApiResponse | void>;
  createCartAsync: (params?: any) => Promise<CartApiResponse | void>;
  deleteCartAsync: (params?: any) => Promise<CartApiResponse | void>;
  attachGuestCartItemsAsync: (params?: any) => Promise<CartApiResponse | void>;
  createCartItemAsync: (params?: any) => Promise<CartApiResponse | void>;
  updateCartItemAsync: (params?: any) => Promise<CartApiResponse | void>;
  deleteCartItemAsync: (params?: any) => Promise<CartApiResponse | void>;
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
        return data;
      }

      // LocalStorage
      else {
        await new Promise((r) => setTimeout(() => r(false), 3000));

        let cart = JSON.parse(localStorage.getItem("cart") || "null");

        const { cartData } = await enrichCartWithProducts({ cart });

        console.log(cartData, " =getCartAsync=");
        set({ cart: cartData });
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
        // get().getCartAsync({cartId})
        successCB({ ...data, message: "Your cart has been cleared." });
        return data;
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

      // set({ cart: data.data });
      get().getCartAsync({ cartId });

      successCB({ ...data, message: "Attached to cart successfully!" });
      return data;
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
        // get().getCartAsync({cartId})

        successCB({ ...data, message: "Added to cart successfully!" });
        return data;
      }

      // LocalStorage
      else {
        // await new Promise((r) => setTimeout(() => r(false), 300));
        const storedCart = JSON.parse(localStorage.getItem("cart") || "null");

        let cart = storedCart || { guestId: `guest-${Date.now()}`, items: [] };

        const newCartItem = {
          id: uuidv4(),
          productId: body.productId,
          variantId: body.variantId,
          variantKey: body.variantKey,
          quantity: body.quantity,
          // productDetails: body.productDetails,
          // variantDetails: body.variantDetails,
        };

        cart = {
          ...cart,
          items: [...cart.items, newCartItem],
        };

        localStorage.setItem("cart", JSON.stringify(cart));

        const { cartData } = await enrichCartWithProducts({ cart });

        console.log(cartData, " =createCartItemAsync=");
        set({ cart: cartData });
        successCB("Added to cart successfully!");
        return cartData;
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
        // get().getCartAsync({cartId})
        successCB({ ...data, message: "Updated successfully!" });
      }

      // LocalStorage
      else {
        await new Promise((r) => setTimeout(() => r(false), 300));

        const storedCart = JSON.parse(localStorage.getItem("cart") || "null");

        let cart = storedCart || { guestId: `guest-${Date.now()}`, items: [] };

        cart = {
          ...cart,
          items: cart.items.map((item: any) => {
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

        const { cartData } = await enrichCartWithProducts({ cart });

        console.log(cartData, " =updateCartItemAsync=");

        set({ cart: cartData });
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
          return data;
        }
        console.log(data, " =deleteCartItemAsync=");

        set({ cart: data.data });
        // get().getCartAsync({cartId})
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

const enrichCartWithProducts = async ({ cart }: any) => {
  const getProductsAsync = useProductStore.getState().getProductsAsync;

  const items = cart.items || [];
  const productIds = items.map((item: any) => item.productId);

  let products: any[] = [];

  if (productIds.length) {
    const data = await getProductsAsync({ query: `?productIds=${productIds.join(",")}` });
    if (data.success) products = data.data.products;
  }

  const enrichedItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId);

    const variant = product?.variants?.find((v: any) => v.id === item.variantId);

    return {
      ...item,
      productDetails: product || "unknown",
      variantDetails: variant || "unknown",
    };
  });

  const cartData = {
    ...cart,
    items: enrichedItems,
  };

  return { cartData };
};
