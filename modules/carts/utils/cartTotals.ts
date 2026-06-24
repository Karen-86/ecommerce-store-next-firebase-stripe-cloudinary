import type { Cart, CartItemWithCheckbox } from "../types";

export const subtotal = (items: CartItemWithCheckbox[]) => {
  return items
    .reduce((total, item) => {
      if (item.productDetails === "unknown" || item.variantDetails === "unknown") return total;

      // const compareAtPrice = item.variantDetails.compareAtPrice ?? 0;
      const compareAtPrice = item.variantDetails.price * 1.2;
      return total + compareAtPrice * item.quantity;
    }, 0)
    .toFixed(2);
};

// const discount = (items: CartItemWithCheckbox[]) => {
//   return items
//     .reduce((total, item) => {
//       return total + (item.variantDetails.compareAtPrice - item.variantDetails.price) * item.quantity;
//     }, 0)
//     .toFixed(2);
// };

export const discount = (items: CartItemWithCheckbox[]) => {
  return Math.abs(
    items.reduce((total, item) => {
      if (item.productDetails === "unknown" || item.variantDetails === "unknown") return total;

      // const compareAtPrice = item.variantDetails.compareAtPrice ?? 0;
      const compareAtPrice = item.variantDetails.price * 1.2;
      const price = item.variantDetails.price ?? 0;

      return total + (compareAtPrice - price) * item.quantity;
    }, 0) ?? 0,
  ).toFixed(2);
};

export const shipping = (cart: Cart | null) => Number(cart?.shipping ?? 0);
export const tax = (cart: Cart | null) => Number(cart?.tax ?? 0);

// export const total = (items: CartItemWithCheckbox[])=> (Number(subtotal) - Number(discount) + shipping + tax).toFixed(2);

export const total = (cart: Cart | null, items: CartItemWithCheckbox[]) => {
  return (
    (items.reduce((total, item) => {
      if (item.productDetails === "unknown" || item.variantDetails === "unknown") return total;

      const price = item.variantDetails.price ?? 0;

      return total + price * item.quantity;
    }, 0) ?? 0) +
    shipping(cart) +
    tax(cart)
  ).toFixed(2);
};
