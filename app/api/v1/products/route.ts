import { NextRequest, NextResponse } from "next/server";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import { stripe } from "@/lib/Stripe";

export async function GET(req: NextRequest) {
  try {
    const products = await stripe.products.list({
      expand: ["data.default_price"],
    });
    const plainProducts = JSON.parse(JSON.stringify(products));

    return NextResponse.json(
      {
        success: true,
        message: "Products found successfully",
        data: plainProducts,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return errorHandlerMiddleware(err);
  }
}
