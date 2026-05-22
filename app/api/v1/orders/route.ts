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

// GET ORDERS
export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const userId = url.searchParams.get("userId");
    const guestId = url.searchParams.get("guestId");

    let ordersRef: FirebaseFirestore.Query = db.collection("orders");

    const decoded = await isAuthenticatedMiddleware(req).catch(() => null);

    if (userId) {
      if (!decoded) throw createError("Unauthorized attempt", 401);
      const { userData: user } = await loadUserMiddleware({ decoded });

      if (userId !== user?.uid) {
        allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });
      }

      ordersRef = ordersRef.where("userId", "==", userId);
    } else if (guestId) {
      ordersRef = ordersRef.where("guestId", "==", guestId);
    } else {
      if (!decoded) throw createError("Unauthorized attempt", 401);
      const { userData: user } = await loadUserMiddleware({ decoded });

      allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });
    }

    const ordersSnap = await ordersRef.get();
    const ordersData = ordersSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "orders found successfully",
        data: {
          amount: ordersData.length,
          orders: ordersData,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
