import Stripe from "stripe";

/* ---------------- BASE DOMAIN ---------------- */

export type ProductBase = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  content?: string;
  rating: number;
  category: string;
  brand: string;
  collections: string[];
  currency: string;
  options: {
    name: string;
    values: string[];
  }[];
  variants: { [key: string]: any }[]
  media:  { [key: string]: any }[]
};

/* ---------------- UI / DOMAIN LAYER ---------------- */

export type Product = ProductBase & {
  // primaryImage: string;
};

export type ProductWithCart = Product & {
  cartMap: {[key:string]:any} | null;
  isInCart: boolean;
};

/* ---------------- API LAYER ---------------- */

export type ProductApi = ProductBase & {
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ProductsApiResponse = ApiResponse<ProductApi[]>;
export type ProductApiResponse = ApiResponse<ProductApi>;

/* ---------------- STRIPE ---------------- */

export type StripeProduct = Stripe.Product;

/* ---------------- REST ---------------- */

export type SearchProduct = {
  id: string;
  label: string;
  value: string;
  price: string;
  description: string;
  startIcon?: React.ReactNode;
};
