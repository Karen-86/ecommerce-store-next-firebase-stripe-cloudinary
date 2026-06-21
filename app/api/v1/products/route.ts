import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import createError from "@/lib/utils/createError";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import { createProductSchema } from "./products.validator";
import admin from "firebase-admin";
import { slugify } from "@/lib/utils/formatters";

// STRIPE
// export async function GET(req: NextRequest) {
//   try {
//     const products = await stripe.products.list({
//       expand: ["data.default_price"],
//     });
//     const plainProducts = JSON.parse(JSON.stringify(products));

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Products found successfully",
//         data: plainProducts,
//       },
//       { status: 200 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }

const DEFAULT_LIMIT = 60;
const MAX_LIMIT = 100;

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const userId = url.searchParams.get("userId");
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order");
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const price = url.searchParams.get("price");
    const search = url.searchParams.get("search")?.toLowerCase().trim();

    const page = Number(url.searchParams.get("page") || 1);
    const limit = Math.min(Number(url.searchParams.get("limit") || DEFAULT_LIMIT), MAX_LIMIT);

    const collectionsParam = url.searchParams.get("collections");
    const collections = collectionsParam ? collectionsParam.split(",").filter(Boolean) : [];

    let productsRef: FirebaseFirestore.Query = db.collection("products");

    if (userId) productsRef = productsRef.where("userId", "==", userId);

    if (sort) {
      const safeOrder = order === "asc" ? "asc" : "desc"; // default to desc if sort is provided
      productsRef = productsRef.orderBy(sort, safeOrder);
    }

    if (category) productsRef = productsRef.where("category", "==", category);
    if (brand) productsRef = productsRef.where("brand", "==", brand);
    if (price) {
      const [min, max] = price.split("-");

      productsRef = productsRef.where("minPrice", ">=", Number(min));

      if (max !== "*") {
        productsRef = productsRef.where("minPrice", "<=", Number(max));
      }
    }

    if (collections.length) {
      productsRef = productsRef.where("collections", "array-contains-any", collections);
    }

    // old simple scenario
    // const limit = url.searchParams.get("limit");
    // if (limit) {
    //   const safeLimit = Math.min(Number(limit), 100); // max 100
    //   productsRef = productsRef.limit(safeLimit);
    // }

    // pagination
    const offset = (page - 1) * limit;
    const totalSnap = await productsRef.get();
    const total = totalSnap.size;

    // const productsSnap = await productsRef.get();
    const productsSnap = await productsRef.offset(offset).limit(limit).get();
    let productsData = productsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (search) {
      productsData = productsData.filter((product: any) => {
        return product.name?.toLowerCase().includes(search);
        // ||
        // product.description?.toLowerCase().includes(search) ||
        // product.brand?.toLowerCase().includes(search) ||
        // product.category?.toLowerCase().includes(search)
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "products found successfully",
        data: {
          totalPages: Math.ceil(total / limit),
          totalCount: total,
          currentPage: page,
          products: productsData,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const body = await req.json();
    const value = validateMiddleware({ schema: createProductSchema, body });

    const { userData: user } = await loadUserMiddleware({ decoded });

    allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const productsRef = db.collection("products");
    const newProductRef = productsRef.doc();

    const baseProductSlug = slugify(value.slug);
    const productSlugExists = await productsRef.where("slug", "==", baseProductSlug).get();
    const slug = productSlugExists.empty ? baseProductSlug : `${baseProductSlug}-${Date.now()}`;

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

    await newProductRef.create({
      ...value,
      slug,
      variants,
      userId: user.id,
      createdBy: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const createdProductSnap = await newProductRef.get();
    const createdProductData = { id: createdProductSnap.id, ...createdProductSnap.data() };

    return NextResponse.json(
      {
        success: true,
        message: `Product created successfully`,
        data: createdProductData,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const productIds = url.searchParams.get("productIds");
    const deleteAll = url.searchParams.get("deleteAll");

    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    // DELETE ALL
    if (deleteAll === "true") {
      const productsRef = db.collection("products");
      const existingProductsSnap = await productsRef.get();

      const deleteBatch = db.batch();

      existingProductsSnap.docs.forEach((doc) => {
        deleteBatch.delete(doc.ref);
      });

      await deleteBatch.commit();
    }

    // DELETE SELECTED
    else if (productIds) {
      const ids = productIds.split(",");

      const deleteSelectedbatch = db.batch();

      ids.forEach((id) => {
        const ref = db.collection("products").doc(id);

        deleteSelectedbatch.delete(ref);
      });

      await deleteSelectedbatch.commit();
    } else {
      throw createError("productIds or deleteAll=true is required", 400);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Products deleted successfully",
        data: null,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
