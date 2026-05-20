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
export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const { order } = await loadResourceMiddleware({
      id: orderId,
      reqKey: "order",
      collectionName: "orders",
    });

    const decoded = await isAuthenticatedMiddleware(req).catch(() => null);

    // 1. Authenticated order
    if (order.userId) {
      if (!decoded) throw createError("Unauthorized attempt to get user", 401);

      isResourceOwnerMiddleware({  actingUser: decoded,  resource: order  });
    }

    // 2. Guest order
    else if (order.guestId) {
      const guestId = req.nextUrl.searchParams.get("guestId");

      if (!guestId || guestId !== order.guestId) {
        throw createError("Unauthorized attempt to get guest", 403);
      }
    }

    // 3. Invalid order (no ownership info at all)
    else {
      throw createError("Invalid order access", 403);
    }

    return NextResponse.json(
      {
        success: true,
        message: "order found successfully",
        data: order,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
