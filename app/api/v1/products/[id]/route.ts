import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import { stripe } from "@/lib/stripe/Stripe";
import createError from "@/lib/utils/createError";

import { db } from "@/lib/firebase/config/firebaseAdmin";
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // const decoded = await isAuthenticatedMiddleware(req);

    const { id } = await params

    const { product } = await loadResourceMiddleware({
      id: id,
      reqKey: "product",
      collectionName: "products",
    })

    return NextResponse.json(
      {
        success: true,
        message: "Product found successfully",
        data: product,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return errorHandlerMiddleware(err)
  }
}
