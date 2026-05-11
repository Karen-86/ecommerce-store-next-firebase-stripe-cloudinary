// /app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/Stripe";
import type { Product } from "@/modules/products/types";
import type { CartBaseItem } from "@/modules/carts/types";
import createError from "@/lib/utils/createError";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";

export async function POST(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const body = await req.json();
    if (!body.cart) throw createError("Cart items are missing", 400);

    const line_items = body.cart.items.map((cartItem: CartBaseItem) => ({
      price_data: {
        currency: cartItem.productDetails.currency, //cad, amd
        product_data: {
          name: cartItem.productDetails.name,
          images: [cartItem.variantDetails.images[0].url],
        },
        unit_amount: Math.round(Number(cartItem.variantDetails.price) * 100), // Stripe expects amount in cents
      },
      quantity: cartItem.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cart`,
      // customer_email: user.email,
      // metadata: {
      //   userId: user.userId,
      // },
      // mode: 'subscription'
    });

    return NextResponse.json(
      {
        success: true,
        message: "Connected with Stripe successfully",
        url: session.url,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return errorHandlerMiddleware(err);
  }
}

// export async function POST() {
//   return new Response(JSON.stringify({ message: 'Dummy placeholder to prevent errors' }), {
//     status: 501
//   });
// }
