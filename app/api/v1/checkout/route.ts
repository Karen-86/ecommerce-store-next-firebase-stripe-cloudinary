// /app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/Stripe";
import type { Product } from "@/modules/products/types";
import type { CartBaseItem } from "@/modules/carts/types";
import createError from "@/lib/utils/createError";
import errorHandlerMiddleware from "@/lib/server/middlewares/system/errorHandler.middleware";
import isAuthenticatedMiddleware from "@/lib/server/middlewares/authentication/isAuthenticated.middleware";
import loadResourceMiddleware from "@/lib/server/middlewares/database/loadResource.middleware";
import validateMiddleware from "@/lib/server/middlewares/validate.middleware";
import loadUserMiddleware from "@/lib/server/middlewares/authentication/loadUser.middleware";
import isOwnerMiddleware from "@/lib/server/middlewares/authorization/isOwner.middleware";
import { db } from "@/lib/firebase/config/firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  try {
    const { cart } = await req.json();
    if (!cart?.items?.length) throw createError("Cart is empty", 400);

    let user = null;

    if (!cart.guestId) {
      const decoded = await isAuthenticatedMiddleware(req);

      // check if requesting user exists in DB and return it (throw error if not exist)
      const { userData } = await loadUserMiddleware({ decoded });

      user = userData;
    }

    // 1. CREATE ORDER FIRST (provider-agnostic)
    const orderRef = db.collection("orders").doc();

    const order = {
      ...(user?.uid ? { userId: user.uid } : {}),
      ...(cart?.guestId ? { guestId: cart.guestId } : {}),
      author: user?.email || "guest",
      items: cart.items,
      amount: cart.items.reduce((sum: number, item: any) => sum + item.quantity * Number(item.variantDetails.price), 0),
      status: "pending",
      paymentStatus: "unpaid",
      ...(user?.addresses ? { shippingAddress: user.addresses?.find((address: any) => address.isDefault) } : {}),
      // expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // auto-delete after 24h
      expiresAt: new Date(Date.now() + 1000 * 60 * 3 ), // auto-delete after 3m
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await orderRef.create(order);

    // 2. CREATE STRIPE SESSION
    const line_items = cart.items.map((item: any) => ({
      price_data: {
        currency: item.productDetails.currency,
        product_data: {
          name: item.productDetails.name,
          images: [item.variantDetails.images[0].url],
        },
        unit_amount: Math.round(Number(item.variantDetails.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/success?orderId=${orderRef.id}`,
      cancel_url: `${baseUrl}/cart`,
      ...(user?.email ? { customer_email: user.email } : {}),
      metadata: {
        orderId: orderRef.id,
        ...(user?.uid ? { userId: user.uid } : {}),
        ...(cart?.guestId ? { guestId: cart.guestId } : {}),
      },

      //  This forces Stripe to print it onto the Dashboard Payment page!
      payment_intent_data: {
        metadata: {
          orderId: orderRef.id,
          ...(user?.uid ? { userId: user.uid } : {}),
          ...(cart?.guestId ? { guestId: cart.guestId } : {}),
        },
      },

      shipping_address_collection: {
        allowed_countries: [
          "AC",
          "AD",
          "AE",
          "AF",
          "AG",
          "AI",
          "AL",
          "AM",
          "AO",
          "AQ",
          "AR",
          "AT",
          "AU",
          "AW",
          "AX",
          "AZ",
          "BA",
          "BB",
          "BD",
          "BE",
          "BF",
          "BG",
          "BH",
          "BI",
          "BJ",
          "BL",
          "BM",
          "BN",
          "BO",
          "BQ",
          "BR",
          "BS",
          "BT",
          "BV",
          "BW",
          "BY",
          "BZ",
          "CA",
          "CD",
          "CF",
          "CG",
          "CH",
          "CI",
          "CK",
          "CL",
          "CM",
          "CN",
          "CO",
          "CR",
          "CV",
          "CW",
          "CY",
          "CZ",
          "DE",
          "DJ",
          "DK",
          "DM",
          "DO",
          "DZ",
          "EC",
          "EE",
          "EG",
          "EH",
          "ER",
          "ES",
          "ET",
          "FI",
          "FJ",
          "FK",
          "FO",
          "FR",
          "GA",
          "GB",
          "GD",
          "GE",
          "GF",
          "GG",
          "GH",
          "GI",
          "GL",
          "GM",
          "GN",
          "GP",
          "GQ",
          "GR",
          "GS",
          "GT",
          "GU",
          "GW",
          "GY",
          "HK",
          "HN",
          "HR",
          "HT",
          "HU",
          "ID",
          "IE",
          "IL",
          "IM",
          "IN",
          "IO",
          "IQ",
          "IS",
          "IT",
          "JE",
          "JM",
          "JO",
          "JP",
          "KE",
          "KG",
          "KH",
          "KI",
          "KM",
          "KN",
          "KR",
          "KW",
          "KY",
          "KZ",
          "LA",
          "LB",
          "LC",
          "LI",
          "LK",
          "LR",
          "LS",
          "LT",
          "LU",
          "LV",
          "LY",
          "MA",
          "MC",
          "MD",
          "ME",
          "MF",
          "MG",
          "MK",
          "ML",
          "MM",
          "MN",
          "MO",
          "MQ",
          "MR",
          "MS",
          "MT",
          "MU",
          "MV",
          "MW",
          "MX",
          "MY",
          "MZ",
          "NA",
          "NC",
          "NE",
          "NG",
          "NI",
          "NL",
          "NO",
          "NP",
          "NR",
          "NU",
          "NZ",
          "OM",
          "PA",
          "PE",
          "PF",
          "PG",
          "PH",
          "PK",
          "PL",
          "PM",
          "PN",
          "PR",
          "PS",
          "PT",
          "PY",
          "QA",
          "RE",
          "RO",
          "RS",
          "RU",
          "RW",
          "SA",
          "SB",
          "SC",
          "SE",
          "SG",
          "SH",
          "SI",
          "SJ",
          "SK",
          "SL",
          "SM",
          "SN",
          "SO",
          "SR",
          "SS",
          "ST",
          "SV",
          "SX",
          "SZ",
          "TA",
          "TC",
          "TD",
          "TF",
          "TG",
          "TH",
          "TJ",
          "TK",
          "TL",
          "TM",
          "TN",
          "TO",
          "TR",
          "TT",
          "TV",
          "TW",
          "TZ",
          "UA",
          "UG",
          "US",
          "UY",
          "UZ",
          "VA",
          "VC",
          "VE",
          "VG",
          "VN",
          "VU",
          "WF",
          "WS",
          "XK",
          "YE",
          "YT",
          "ZA",
          "ZM",
          "ZW",
        ],
      },
    });

    // 3. SAVE PAYMENT REFERENCE
    await orderRef.update({
      paymentProvider: "stripe",
      paymentSessionId: session.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order ready! Redirecting to checkout...",
        data: {
          url: session.url,
          orderId: orderRef.id,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return errorHandlerMiddleware(err);
  }
}

// OlD VERSION WITHOUT ORER SYSTEM
// export async function POST(req: Request) {
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   try {
//     const body = await req.json();
//     if (!body.cart) throw createError("Cart items are missing", 400);

//     const line_items = body.cart.items.map((cartItem: CartBaseItem) => ({
//       price_data: {
//         currency: cartItem.productDetails.currency, //cad, amd
//         product_data: {
//           name: cartItem.productDetails.name,
//           images: [cartItem.variantDetails.images[0].url],
//         },
//         unit_amount: Math.round(Number(cartItem.variantDetails.price) * 100), // Stripe expects amount in cents
//       },
//       quantity: cartItem.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${baseUrl}/success`,
//       cancel_url: `${baseUrl}/cart`,
//       // customer_email: user.email,
//       // metadata: {
//       //   userId: user.userId,
//       // },
//       // mode: 'subscription'
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Connected with Stripe successfully",
//         url: session.url,
//       },
//       { status: 200 },
//     );
//   } catch (err: any) {
//     console.error("Stripe checkout error:", err);
//     return errorHandlerMiddleware(err);
//   }
// }

// export async function POST() {
//   return new Response(JSON.stringify({ message: 'Dummy placeholder to prevent errors' }), {
//     status: 501
//   });
// }
