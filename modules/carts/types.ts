export type CartBaseItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  variantKey: string;
  productDetails: { [key: string]: any } | 'unknown';
  variantDetails: { [key: string]: any } | 'unknown';
};

export type CartBase = {
  guestId?: string;
  items: CartBaseItem[];
  shipping?: number;
  tax?: number;
};

/* ---------------- UI / DOMAIN LAYER ---------------- */

export type Cart = CartBase;

export type CartItemWithCheckbox = CartBaseItem & {
  isSelected: boolean;
};

/* ---------------- API LAYER ---------------- */

export type CartApi = CartBase & {
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

export type CartsApiResponse = ApiResponse<CartApi[] | any>;
export type CartApiResponse = ApiResponse<CartApi | any>;
