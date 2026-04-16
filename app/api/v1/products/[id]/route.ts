import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import { stripe } from "@/lib/Stripe";
import createError from "@/lib/utils/createError";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) throw createError("Invalid ID", 400);

    const product = await stripe.products.retrieve(id, {
      expand: ["default_price"],
    });
    const serializedProduct = JSON.parse(JSON.stringify(product));

    return NextResponse.json(
      {
        success: true,
        message: "Product found successfully",
        data: serializedProduct,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
