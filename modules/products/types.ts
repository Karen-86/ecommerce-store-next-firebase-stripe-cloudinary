import Stripe from "stripe";

export type Product = {
  id: string;
  name: string;
  description?: string;
  images: string[];
  rating: number;
  //
  price: number;
  quantity: number;
  isInCart: boolean;
}


export type ProductResponse = Stripe.Product;

export type StoredProduct = {
  productId: string;
  quantity?: number;
};

export type SearchProduct = {
  label: string;
  value: string;
  price: string;
  description: string;
  startIcon: React.ReactElement;
  isSelected?: boolean
}