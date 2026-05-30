import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";

// STRIPE
// export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params;
//     if (!id) throw createError("Invalid ID", 400);

//     const product = await stripe.products.retrieve(id, {
//       expand: ["default_price"],
//     });
//     const serializedProduct = JSON.parse(JSON.stringify(product));

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Product found successfully",
//         data: serializedProduct,
//       },
//       { status: 200 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }

export async function GET(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    // const decoded = await isAuthenticatedMiddleware(req);

    const { productId } = await params;

    const { product } = await loadResourceMiddleware({
      id: productId,
      reqKey: "product",
      collectionName: "products",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product found successfully",
        data: product,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);
    const { userData: user } = await loadUserMiddleware({ decoded });
    allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const { productId } = await params;
    const { productRef, product } = await loadResourceMiddleware({
      id: productId,
      reqKey: "product",
      collectionName: "products",
    });

    await productRef.delete();

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: product,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
