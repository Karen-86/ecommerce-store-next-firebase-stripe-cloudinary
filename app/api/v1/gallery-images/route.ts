import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import allowRolesMiddleware from "@/lib/server/middlewares/authorization/allowRoles.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import createError from "@/lib/utils/createError";
import admin from "firebase-admin";
import * as imageUtils from "@/lib/server/utils/imageUtils";
import * as cloudinaryService from "@/services/cloudinaryService";

const MAX_SIZE = 300 * 1024; // 300KB

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const userId = url.searchParams.get("userId");
    const sort = url.searchParams.get("sort");
    const order = url.searchParams.get("order");
    const search = url.searchParams.get("search")?.toLowerCase().trim();

    let galleryImagesRef: FirebaseFirestore.Query = db.collection("gallery-images");

    if (userId) galleryImagesRef = galleryImagesRef.where("userId", "==", userId);

    if (sort) {
      const safeOrder = order === "asc" ? "asc" : "desc"; // default to desc if sort is provided
      galleryImagesRef = galleryImagesRef.orderBy(sort, safeOrder);
    }

    const galleryImagesSnap = await galleryImagesRef.get();
    const total = galleryImagesSnap.size;
    let galleryImagesData = galleryImagesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (search) {
      galleryImagesData = galleryImagesData.filter((image: any) => {
        return image.name?.toLowerCase().includes(search);
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery images found successfully",
        data: {
          totalCount: total,
          images: galleryImagesData,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}

// single image create
// export async function POST(req: NextRequest) {
//   try {
//     const decoded = await isAuthenticatedMiddleware(req);

//     const { userData: user } = await loadUserMiddleware({ decoded });

//     allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

//     const galleryImagesRef = db.collection("gallery-images");
//     const newGalleryImageRef = galleryImagesRef.doc();

//     const formData = await req.formData();
//     const files = formData.getAll("files") as File[];

//     if (!files || !files[0]) throw createError("No file uploaded", 400);

//     const file = files[0];

//     const arrayBuffer = await file.arrayBuffer();
//     let buffer = Buffer.from(arrayBuffer);

//     if (buffer.length > MAX_SIZE) buffer = await imageUtils.resizeImage({ buffer });

//     const createdResult: any = await cloudinaryService.createImage({
//       buffer,
//       folderPath: `products/gallery-images`,
//       publicId: `${newGalleryImageRef.id}_${Date.now()}`,
//     });

//     const uploadedPublicId = createdResult.public_id;

//     const image = {
//       name: createdResult.original_filename,
//       publicId: createdResult.public_id,
//       url: createdResult.secure_url,
//     };

//     await newGalleryImageRef.create({
//       ...image,
//       userId: user.id,
//       createdBy: user.email,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     const createdGalleryImageSnap = await newGalleryImageRef.get();
//     const createdGalleryImageData = { id: createdGalleryImageSnap.id, ...createdGalleryImageSnap.data() };

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Gallery image created successfully",
//         data: createdGalleryImageData,
//       },
//       { status: 201 },
//     );
//   } catch (err: any) {
//     return errorHandlerMiddleware(err);
//   }
// }

// multiple image create
export async function POST(req: NextRequest) {
  try {
    const decoded = await isAuthenticatedMiddleware(req);

    const { userData: user } = await loadUserMiddleware({ decoded });

    allowRolesMiddleware({ userRoles: user.roles, allowedRoles: ["admin", "superAdmin"] });

    const galleryImagesRef = db.collection("gallery-images");
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        throw createError("Only image files are allowed", 400);
      }
    }

    if (!files || !files.length) throw createError("No file uploaded", 400);

    const createdGalleryImagesData = await Promise.all(
      files.map(async (file) => {
        const newGalleryImageRef = galleryImagesRef.doc();

        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        if (buffer.length > MAX_SIZE) buffer = await imageUtils.resizeImage({ buffer });

        const createdResult: any = await cloudinaryService.createImage({
          buffer,
          folderPath: `products/gallery-images`,
          publicId: `${newGalleryImageRef.id}_${Date.now()}`,
        });

        const image = {
          name: file.name,
          extension: file.name.split(".").pop()?.toLowerCase(),
          // name: createdResult.original_filename,
          publicId: createdResult.public_id,
          url: createdResult.secure_url,
        };

        await newGalleryImageRef.create({
          ...image,
          userId: user.id,
          createdBy: user.email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const createdGalleryImageSnap = await newGalleryImageRef.get();

        const createdGalleryImageData = { id: createdGalleryImageSnap.id, ...createdGalleryImageSnap.data() };

        return createdGalleryImageData;
      }),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Gallery image(s) created successfully",
        data: {
          totalCount: createdGalleryImagesData.length,
          images: createdGalleryImagesData,
        },
      },
      { status: 201 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
