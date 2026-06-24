import Stripe from "stripe";

/* ---------------- BASE DOMAIN ---------------- */

export type ProductBase = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  rating?: number;
  category: string;
  brand: string;
  collections: string[];
  currency: string;
  options: OptionType[];
  variants: VariantType[];
  media: MediaItemType[];
  seo?: SeoType;
  status?: string
};

/* ---------------- UI / DOMAIN LAYER ---------------- */

export type Product = ProductBase & {
  // primaryImage: string;
};

export type ProductWithCart = Product & {
  cartMap: { [key: string]: any } | null;
  isInCart: boolean;
};

/* ---------------- API LAYER ---------------- */

export type ProductApi = ProductBase & {
  userId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ProductsApiResponse = ApiResponse<ProductApi[] | any>;
export type ProductApiResponse = ApiResponse<ProductApi | any>;

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

export type ProductFormType = Partial<ProductBase>;

export type BasicInfoType = {
  title: string;
  slug: string;
  description?: string;
  media: { [key: string]: any }[];
  category: string;
  currency: string
};

export type OptionType = {
  id: string;
  name: string;
  values: string[];
  isSaved?: boolean;
};

export type VariantType = {
  id: string;
  sku: string;
  stock: number | null;
  price: string | number | null;
  compareAtPrice: string | number | null;
  // images: { [key: string]: any }[];
  images: string[];
  primaryImage: string;
  attributes: { [key: string]: any };
};

export type SeoType = {
  title: string;
  description?: string;
};


export type MediaItemType = {
  id: string;
  url: string;
};