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
import { v4 as uuidv4 } from "uuid";

// UPDATE CART ITEM
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ cartId: string; cartItemId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { cartId, cartItemId } = await params;

    // CHECK IF CART EXISTS
    let { cartRef, cartSnap, cart } = await loadResourceMiddleware({
      id: cartId,
      reqKey: "cart",
      collectionName: "carts",
      ignoreNotFound: true,
    });

    if (!cart) throw createError("Cart not found", 404);

    isResourceOwnerMiddleware({ actingUser: decoded, resource: cart });

    const body = await req.json();

    // CHECK IF CART ITEM EXISTS
    const existingCartItem = cart.items.some((item: any) => item.id === cartItemId);
    if (!existingCartItem) throw createError("Cart item not found", 404);

    const updatedCart = {
      ...cartSnap.data(),
      items: cart.items.map((item: any) => {
        if (item.id !== cartItemId) return item;
        return {
          ...item,
          quantity: body.quantity,
        };
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await cartRef.update(updatedCart);

    const updatedCartSnap = await cartRef.get();
    const updatedCartData = { id: updatedCartSnap.id, ...updatedCartSnap.data() };

    return NextResponse.json(
      {
        success: true,
        message: "cart item updated successfully",
        data: updatedCartData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

// DELETE CART ITEM
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cartId: string; cartItemId: string }> },
) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { cartId, cartItemId } = await params;

    // CHECK IF CART EXISTS
    let { cartRef, cartSnap, cart } = await loadResourceMiddleware({
      id: cartId,
      reqKey: "cart",
      collectionName: "carts",
      ignoreNotFound: true,
    });

    if (!cart) throw createError("Cart not found", 404);

    isResourceOwnerMiddleware({ actingUser: decoded, resource: cart });

    // CHECK IF CART ITEM EXISTS
    const existingCartItem = cart.items.some((item: any) => item.id === cartItemId);
    if (!existingCartItem) throw createError("Cart item not found", 404);

    const updatedCart = {
      ...cartSnap.data(),
      items: cart.items.filter((item: any) => item.id !== cartItemId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await cartRef.update(updatedCart);

    const updatedCartSnap = await cartRef.get();
    const updatedCartData = { id: updatedCartSnap.id, ...updatedCartSnap.data() };

    return NextResponse.json(
      {
        success: true,
        message: "cart item deleted successfully",
        data: updatedCartData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
