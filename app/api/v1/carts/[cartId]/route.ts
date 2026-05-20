import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import createError from "@/lib/utils/createError";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import checkRoleHierarchyMiddleware from "@/lib/server/middlewares/authorization/checkRoleHierarchy.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isResourceOwnerMiddleware from "@/lib/server/middlewares/authorization/isResourceOwner.middleware";

// GET CART
export async function GET(req: NextRequest, { params }: { params: Promise<{ cartId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { cartId } = await params;
    const { cart } = await loadResourceMiddleware({
      id: cartId,
      reqKey: "cart",
      collectionName: "carts",
    });

    return NextResponse.json(
      {
        success: true,
        message: "cart found successfully",
        data: cart,
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
        message: "cart item created successfully",
        data: updatedCartData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}