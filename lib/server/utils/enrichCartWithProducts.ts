import { db } from "@/lib/firebase/config/firebaseAdmin";
import admin from "firebase-admin";

import type { Cart } from "@/modules/carts/types";

export const enrichCartWithProducts = async ({ cart }: { cart: Cart }) => {
  const items = cart.items || [];
  const productIds = items.map((item: any) => item.productId);

  let products: any[] = [];

  if (productIds.length) {
    const snap = await db.collection("products").where(admin.firestore.FieldPath.documentId(), "in", productIds).get();

    products = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  const enrichedItems = items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId);

    const variant = product?.variants?.find((v: any) => v.id === item.variantId);

    return {
      ...item,
      productDetails: product || 'unknown',
      variantDetails: variant || 'unknown',
    };
  });

  const cartData = {
    ...cart,
    items: enrichedItems,
  };

  return { cartData };
};
