import { doc, getDoc, getDocs, collection, query, orderBy, where, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config/firebaseClient";
import { notFound } from "next/navigation";
import type { Product, ProductApi } from "./types";

export async function fetchProducts() {
  try {
    const productsRef = collection(db, "products");
    const productsSnap = await getDocs(productsRef);
    const data = productsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ProductApi[];

    //  await new Promise((resolve) => setTimeout(() => resolve("done"), 5000));
    return {
      success: true,
      message: "success",
      data: data.map((item) => {
        const { createdAt, updatedAt, ...rest } = item;
        return rest;
      }),
    };
  } catch (err: any) {
    console.error("=fetchProducts= error:", err);
    return { success: false, message: err.message, data: null };
  }
}

// export async function fetchProduct({ productId = "" }) {
//   try {
//     if (!productId) throw new Error("Invalid ID");

//     const productsRef = collection(db, "products");
//     const productRef = doc(productsRef, productId);
//     const productSnap = await getDoc(productRef);

//     if (!productSnap.exists()) throw new Error("Document not found");

//     const data: any = { id: productSnap.id, ...productSnap.data() };
//     const { createdAt, updatedAt, ...rest } = data;

//     return { success: true, message: 'success', data: rest };
//   } catch (err: any) {
//     console.error("=fetchProduct= error:", err);
//     return { success: false, message: err.message, data: null };
//   }
// }

export async function fetchProductBySlug({ productSlug = "" }) {
  try {
    if (!productSlug) throw new Error("Invalid slug");

    const productsRef = collection(db, "products");
    const q = query(productsRef, where("slug", "==", productSlug), limit(1));
    const querySnap = await getDocs(q);

    if (querySnap.empty) throw new Error("Document not found");

    const productDoc = querySnap.docs[0];
    const productRef = productDoc.ref;

    const data = { id: productDoc.id, ...productDoc.data() } as ProductApi;
    const { createdAt, updatedAt, ...rest } = data;
    return { success: true, message: "success", data: rest };
  } catch (err: any) {
    console.error("=fetchProduct= error:", err);
    return { success: false, message: err.message, data: null };
  }
}
