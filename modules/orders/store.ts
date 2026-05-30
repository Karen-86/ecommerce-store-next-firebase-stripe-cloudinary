import { create } from "zustand";
import type {OrderApiResponse} from "@/modules/orders/types";
import * as ordersApi from "@/modules/orders/api";
import { useAuthStore } from "../auth/store";
import { v4 as uuidv4 } from "uuid";

const noop = () => {};

type OrderStore = {
  getOrdersAsync: (params?: any) => Promise<OrderApiResponse>;
  getOrderAsync: (params?: any) => Promise<OrderApiResponse>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  getOrdersAsync: async ({ query = "", successCB = noop, errorCB = noop } = {}) => {
    const data = await ordersApi.getOrders({ query });

    if (!data.success) {
      errorCB(data);
      return data;
    }
    console.log(data, " =getOrdersAsync=");

    successCB(data);
    return data ;
  },

  getOrderAsync: async ({ orderId = "", query = "", successCB = noop, errorCB = noop } = {}) => {
    const data = await ordersApi.getOrder({ orderId, query });

    if (!data.success) {
      errorCB(data);
      return data;
    }
    console.log(data, " =getOrderAsync=");

    successCB(data);
    return data
  },
}));
