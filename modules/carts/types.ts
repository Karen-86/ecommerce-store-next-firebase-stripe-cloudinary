export type CartBaseItem = {
  id: string;
  productId: string;
  quantity: number;
  variantKey: string;
  productDetails: { [key: string]: any };
  variantDetails: { [key: string]: any };
};

export type CartBase = {
  userId: string;
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

export type ApiCart = CartBase & {
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CartsApiResponse = ApiResponse<ApiCart[]>;
export type CartApiResponse = ApiResponse<ApiCart>;
