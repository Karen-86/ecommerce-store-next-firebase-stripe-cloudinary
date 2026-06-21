import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import createError from "@/lib/utils/createError";

export async function POST(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();

    const { userData } = await loadUserMiddleware({ decoded });

    const user = userData;

    allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin","superAdmin"] });

    const productsRef = db.collection("products");

    // 1. delete all existing products
    const existingProductsSnap = await productsRef.get();

    const deleteBatch = db.batch();

    existingProductsSnap.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });

    await deleteBatch.commit();

    // 2. upload new products
    const uploadBatch = db.batch();

    // firebase allow max 500 items
    body.products.forEach((product: any) => {
      const productRef = productsRef.doc(product.id);
      uploadBatch.set(productRef, product);
    });

    await uploadBatch.commit();

    return NextResponse.json(
      {
        success: true,
        message: `${body.products.length} products uploaded successfully`,
        data: null,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}