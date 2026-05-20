import { NextRequest, NextResponse } from "next/server";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createUserAddressSchema } from "../../users.validator";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isOwnerMiddleware from "@/lib/server/middlewares/authorization/isOwner.middleware";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    const body = await req.json();

    const value = validateMiddleware({ schema: createUserAddressSchema, body });

    const { userId } = await params;

    const { foundUserRef, foundUser } = await loadResourceMiddleware({
      id: userId,
      reqKey: "foundUser",
      collectionName: "users",
    });

    isOwnerMiddleware({ actingUser: decoded, targetUser: foundUser });

    const isDefaultAddressExist = (foundUser.addresses || []).some((address: any) => address.isDefault)
    
    const addresses = [
      ...(foundUser.addresses || []),
      {
        id: "address-" + uuidv4(),
        ...value,
        isDefault: !isDefaultAddressExist,
      },
    ];

    const updatedUser = {
      addresses,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await foundUserRef.update(updatedUser);

    const updatedUserSnap = await foundUserRef.get();
    const updatedUserData = updatedUserSnap.data();

    return NextResponse.json(
      {
        success: true,
        message: "user address added successfully",
        data: updatedUserData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
