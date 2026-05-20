import { NextRequest, NextResponse } from "next/server";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import admin from "firebase-admin";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createUserAddressSchema } from "../../../users.validator";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isOwnerMiddleware from "@/lib/server/middlewares/authorization/isOwner.middleware";
import createError from "@/lib/utils/createError";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string; addressId: string }> }) {
  try {
    const url = req.nextUrl;
    const action = url.searchParams.get("action");
    const { userId, addressId } = await params;

    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    const body = await req.json();

    let value = {};
    if (!action) value = validateMiddleware({ schema: createUserAddressSchema, body });

    const { foundUserRef, foundUser } = await loadResourceMiddleware({
      id: userId,
      reqKey: "foundUser",
      collectionName: "users",
    });

    isOwnerMiddleware({ actingUser: decoded, targetUser: foundUser });

    const addressExist = foundUser.addresses.some((address: any) => address.id === addressId);
    if (!addressExist) throw createError("Address not found", 404);

    let addresses = [...foundUser.addresses];

    if (action === "setDefaultAddress") {
      // addresses = addresses.map((address: any) => {
      //   return {
      //     ...address,
      //     isDefault: address.id === addressId,
      //   };
      // });
      addresses = addresses.map((address: any) => ({ ...address, isDefault: address.id === addressId }));
    }

    if (!action) {
      // addresses = addresses.map((address: any) => {
      //   if (address.id !== addressId) return address;
      //   return {
      //     ...address,
      //     ...value,
      //   };
      // });
      addresses = addresses.map((address: any) => (address.id === addressId ? { ...address, ...value } : address));
    }

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
        message: "User address updated successfully",
        data: updatedUserData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string; addressId: string }> }) {
  try {
    const { userId, addressId } = await params;

    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    const { foundUserRef, foundUser } = await loadResourceMiddleware({
      id: userId,
      reqKey: "foundUser",
      collectionName: "users",
    });

    isOwnerMiddleware({ actingUser: decoded, targetUser: foundUser });

    const addressExist = foundUser.addresses.some((address: any) => address.id === addressId);
    if (!addressExist) throw createError("Address not found", 404);

    let addresses = [...foundUser.addresses];

    addresses = addresses.filter((address: any) => address.id !== addressId);

    const defaultExist = addresses.some((address) => address.isDefault);
    if (!defaultExist && addresses.length) addresses[0].isDefault = true;

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
        message: "User address deleted successfully",
        data: updatedUserData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
