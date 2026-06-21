import Stripe from "stripe";

/* ---------------- BASE DOMAIN ---------------- */

export type GalleryImageBase = {
  id: string;
  url: string;
  name: string;
  extension: string;
};

/* ---------------- UI / DOMAIN LAYER ---------------- */

export type GalleryImage = GalleryImageBase & {
  // primaryImage: string;
};

/* ---------------- API LAYER ---------------- */

export type GalleryImageApi = GalleryImageBase & {
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

export type GalleryImagesApiResponse = ApiResponse<GalleryImageApi[] | any>;
export type GalleryImageApiResponse = ApiResponse<GalleryImageApi | any>;

// /* ---------------- STRIPE ---------------- */

// export type StripeProduct = Stripe.Product;

// /* ---------------- REST ---------------- */

// export type SearchProduct = {
//   id: string;
//   label: string;
//   value: string;
//   price: string;
//   description: string;
//   startIcon?: React.ReactNode;
// };

// export type ProductFormType = Partial<GalleryImageBase>;


// export type OptionType = {
//   id: string;
//   name: string;
//   values: string[];
//   isSaved?: boolean;
// };

// export type VariantType = {
//   id: string;
//   sku: string;
//   stock: number | null;
//   price: string | number | null;
//   compareAtPrice: string | number | null;
//   images: { [key: string]: any }[];
//   primaryImage: string;
//   attributes: { [key: string]: any };
// };

// export type SeoType = {
//   title: string;
//   description?: string;
// };
