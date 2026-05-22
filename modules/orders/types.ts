import Stripe from "stripe";

/* ---------------- BASE DOMAIN ---------------- */

export type OrderBase = {
  id: string;
  userId: string;
  author: string;
  amount: number;
  shippingAddress: { [key: string]: any };
  paymentProvider: string;
  paymentSessionId: string;
  shipping: string;
  stripe: { [key: string]: any };
  paidAt: { [key: string]: any };
  items: { [key: string]: any }[];
  paymentStatus: string;
  status: string;
};

/* ---------------- UI / DOMAIN LAYER ---------------- */

export type Order = OrderBase;

/* ---------------- API LAYER ---------------- */

export type OrderApi = OrderBase & {
  expiresAt: Date;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type OrderssApiResponse = ApiResponse<OrderApi[]>;
export type OrderApiResponse = ApiResponse<OrderApi>;

/* ---------------- REST ---------------- */
