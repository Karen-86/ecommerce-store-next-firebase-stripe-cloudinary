import { NextRequest, NextResponse } from "next/server";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";
import { enrichCartWithProducts } from "@/lib/server/utils/enrichCartWithProducts";


// GET CART
export async function GET(req: NextRequest, { params }: { params: Promise<{ cartId: string }> }) {
  try {
    await isAuthenticatedMiddleware(req);

    const { cartId } = await params;

    const { cart } = await loadResourceMiddleware({
      id: cartId,
      reqKey: "cart",
      collectionName: "carts",
    });

    const {cartData} = await enrichCartWithProducts({cart})

    return NextResponse.json(
      {
        success: true,
        message: "cart found successfully",
        data: cartData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

// DELETE CART
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cartId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { cartId } = await params;

    // CHECK IF CART EXISTS
    let { cartRef, cartSnap, cart } = await loadResourceMiddleware({
      id: cartId,
      reqKey: "cart",
      collectionName: "carts",
    });

    isResourceOwnerMiddleware({ actingUser: decoded, resource: cart });

    const updatedCart = {
      ...cartSnap.data(),
      items: [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await cartRef.update(updatedCart);

    const updatedCartSnap = await cartRef.get();
    const updatedCartData = { id: updatedCartSnap.id, ...updatedCartSnap.data() };

    return NextResponse.json(
      {
        success: true,
        message: "cart items removed successfully",
        data: updatedCartData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
