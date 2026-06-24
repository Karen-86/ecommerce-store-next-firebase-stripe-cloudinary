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
import { enrichCartWithProducts } from "@/lib/server/utils/enrichCartWithProducts";

// CREATE CART ITEM
export async function POST(req: NextRequest, { params }: { params: Promise<{ cartId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { cartId } = await params;

    // CHECK IF CART EXISTS
    let { cartRef, cartSnap, cart } = await loadResourceMiddleware({
      id: cartId,
      reqKey: "cart",
      collectionName: "carts",
      ignoreNotFound: true,
    });

    // CREATE CART IF NOT EXIST
    if (!cart) {
      const { userData } = await loadUserMiddleware({ decoded });

      const user = userData;

      const cartsRef = db.collection("carts");
      const newCartRef = cartsRef.doc(user.id);

      await newCartRef.create({
        userId: user.id,
        createdBy: user.email,
        items: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      cartRef = db.collection("carts").doc(user.id);
      cartSnap = await cartRef.get();

      cart = { id: cartSnap.id, ...cartSnap.data() };
    }

    isResourceOwnerMiddleware({ actingUser: decoded, resource: cart });

    const body = await req.json();

    //  CHECK FOR DUPLICATES
    const duplicateItem = cart.items.some(
      (item: any) => item.variantKey === body.variantKey && item.productId === body.productId,
    );
    if (duplicateItem) throw createError("Cart item already exists", 409);

    const updatedCart = {
      ...cartSnap.data(),
      items: [
        ...cart.items,
        {
          id: uuidv4(),
          productId: body.productId,
          variantId: body.variantId,
          variantKey: body.variantKey,
          quantity: body.quantity,
          // variantDetails: body.variantDetails,
          // productDetails: body.productDetails,
        },
      ],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await cartRef.update(updatedCart);

    const updatedCartSnap = await cartRef.get();
    const updatedCartData = { id: updatedCartSnap.id, ...updatedCartSnap.data() };

    const {cartData} = await enrichCartWithProducts({cart: updatedCartData})

    return NextResponse.json(
      {
        success: true,
        message: "cart item created successfully",
        data: cartData,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

