import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createProductSchema } from "../products.validator";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import { slugify } from "@/lib/utils/formatters";
import admin from "firebase-admin";

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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: createProductSchema, body });

    const { productId } = await params;

    // will throw 404 if not found
    const { productRef, productSnap, product } = await loadResourceMiddleware({
      id: productId,
      reqKey: "product",
      collectionName: "products",
    });

    const { userData: user } = await loadUserMiddleware({ decoded });

    allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const productsRef = db.collection("products");

    let slug = null;
    if (value.slug) {
      const baseProductSlug = slugify(value.slug);
      const productSlugExists = await productsRef.where("slug", "==", baseProductSlug).get();
      const slugTakenByOther = productSlugExists.docs.some((doc) => doc.id !== productId);
      slug = slugTakenByOther ? `${baseProductSlug}-${Date.now()}` : baseProductSlug;
    }

    const variants =
      Array.isArray(value.variants) && value.variants.length
        ? value.variants
        : [
            {
              id: `variant-${crypto.randomUUID()}`,
              sku: "",
              stock: 0,
              price: null,
              compareAtPrice: null,
              images: [],
              primaryImage: "",
              attributes: {},
            },
          ];

    const updatedProduct = {
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (slug) updatedProduct.slug = slug;
    if (value.variants) updatedProduct.variants = variants;

    await productRef.update(updatedProduct);

    const updatedProductSnap = await productRef.get();
    const updatedProductData = { id: updatedProductSnap.id, ...updatedProductSnap.data() };

    return NextResponse.json(
      {
        success: true,
        message: `Product updated successfully`,
        data: updatedProductData,
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
