import { create } from "zustand";
import type { Cart, CartBaseItem } from "@/modules/carts/types";
import * as ordersApi from "@/modules/orders/api";
import { useAuthStore } from "../auth/store";
import { v4 as uuidv4 } from "uuid";

const noop = () => {};

type OrderStore = {
  isOrderLoading: boolean;
  getOrderAsync: (params?: any) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  isOrderLoading: false,

  getOrderAsync: async ({ orderId = "", query = '', successCB = noop, errorCB = noop } = {}) => {
    set({ isOrderLoading: true });

    try {
      // Firestore
    //   if (get().cartMode === "user") {
        const data = await ordersApi.getOrder({ orderId, query });

        if (!data.success) return errorCB(data);
        console.log(data, " =getOrderAsync=");

        // set({ order: data.data });
        successCB(data);
    //   }

    //   // LocalStorage
    //   else {
    //     await new Promise((r) => setTimeout(() => r(false), 3000));

    //     let cart = JSON.parse(localStorage.getItem("cart") || "null");
    //     set({ cart: cart });
    //   }
    } finally {
      set({ isOrderLoading: false });
    }
  },
}));
